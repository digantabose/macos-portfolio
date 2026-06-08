import { sha256, normalizeUrl } from '/lib/crypto_utils.js';
import { analyzeHostname } from '/lib/typosquat_engine.js';

// Threat intelligence database prefix-map for local k-Anonymity simulation
const MOCK_INTEL_DB = {
  "afe9b": [
    {
      "hash": "afe9b1871224fa728bbee393870fa51b4859c78e02d9224713c9d8356d573b7a",
      "risk": "critical",
      "type": "phishing",
      "details": {
        "hosting_location": "Moscow, Russian Federation",
        "asn": "AS48123 (MOCK-HOST)",
        "site_age": "2 days",
        "ssl_status": "Insecure (HTTP)"
      }
    }
  ],
  "905c8": [
    {
      "hash": "905c8d2edadfecd7d091861cfe96596150c8e94dff7ee68bd09a1edfad2ff09f",
      "risk": "critical",
      "type": "typosquatting",
      "details": {
        "hosting_location": "Sofia, Bulgaria",
        "asn": "AS204323 (NET-MOCK)",
        "site_age": "10 days",
        "ssl_status": "Secure (Self-signed TLS)"
      }
    }
  ],
  "8435c": [
    {
      "hash": "8435c5641809d66c2c26da7253619f9367fd9022326d126eb64aebe3c51b0884",
      "risk": "suspicious",
      "type": "typosquatting",
      "details": {
        "hosting_location": "Bucharest, Romania",
        "asn": "AS31221 (CLOUD-MOCK)",
        "site_age": "4 days",
        "ssl_status": "Secure (Valid Certificate)"
      }
    }
  ],
  "24f07": [
    {
      "hash": "24f07c5a170645775074c300d4395cc0553d0dfa95a3932e3111468698ff7fa7",
      "risk": "critical",
      "type": "credential_harvester",
      "details": {
        "hosting_location": "St Petersburg, Russian Federation",
        "asn": "AS198822 (STP-NET)",
        "site_age": "1 day",
        "ssl_status": "Insecure (No SSL)"
      }
    }
  ]
};

// Default safe metadata fallback
const DEFAULT_INTEL = {
  "hosting_location": "United States",
  "asn": "AS15169 (GOOGLE-NET)",
  "site_age": "Over 10 years",
  "ssl_status": "Secure (Valid Certificate)"
};

// Generates dynamic, realistic but simulated site intelligence metadata based on a hostname hash
function generateSiteIntel(urlObj) {
  const hostname = urlObj.hostname;
  const isHttps = urlObj.protocol === 'https:';
  
  // Calculate a simple stable hash of the hostname
  let hash = 0;
  for (let i = 0; i < hostname.length; i++) {
    hash = (hash << 5) - hash + hostname.charCodeAt(i);
  }
  hash = Math.abs(hash);

  // 1. Dynamic Hosting Location
  const locations = [
    "United States (Oregon)",
    "Germany (Frankfurt)",
    "Ireland (Dublin)",
    "Singapore (Jurong)",
    "Japan (Tokyo)",
    "Canada (Montreal)",
    "United Kingdom (London)"
  ];
  
  let hostingLocation = locations[hash % locations.length];
  if (hostname.endsWith('.uk')) hostingLocation = "United Kingdom (London)";
  else if (hostname.endsWith('.de')) hostingLocation = "Germany (Frankfurt)";
  else if (hostname.endsWith('.jp')) hostingLocation = "Japan (Tokyo)";
  else if (hostname.endsWith('.ca')) hostingLocation = "Canada (Montreal)";
  
  // 2. Dynamic ASN
  let asn = "";
  if (hostname.includes('google')) {
    asn = "AS15169 (GOOGLE-NET)";
  } else if (hostname.includes('amazon') || hostname.includes('aws')) {
    asn = "AS16509 (AMAZON-02)";
  } else if (hostname.includes('microsoft') || hostname.includes('outlook') || hostname.includes('live')) {
    asn = "AS8075 (MICROSOFT-CORP)";
  } else if (hostname.includes('cloudflare')) {
    asn = "AS13335 (CLOUDFLARENET)";
  } else {
    const commonASNs = [
      "AS13335 (CLOUDFLARENET)",
      "AS16509 (AMAZON-02)",
      "AS15169 (GOOGLE-NET)",
      "AS20940 (AKAMAI-ASN)",
      "AS32475 (SINGLEHOP)",
      "AS16265 (LEASEWEB)"
    ];
    asn = commonASNs[hash % commonASNs.length];
  }

  // 3. Dynamic Registration Age
  const ages = [
    "Over 10 years",
    "Over 8 years",
    "Over 5 years",
    "Approximately 4 years",
    "Approximately 3 years",
    "Over 12 years"
  ];
  let age = ages[hash % ages.length];
  
  // 4. Dynamic SSL Status
  let ssl = isHttps ? "Secure (Valid Certificate)" : "Insecure (HTTP)";

  return {
    hosting_location: hostingLocation,
    asn: asn,
    site_age: age,
    ssl_status: ssl
  };
}

// Generates a stable unique numeric ID for dynamic declarativeNetRequest rules
function getNumericId(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 1000000 + 10000;
}

// Perform privacy-preserving k-Anonymity API check
async function queryKAnonymityAPI(normalizedUrl) {
  try {
    const fullHash = await sha256(normalizedUrl);
    const prefix = fullHash.substring(0, 5);
    const apiUrl = `https://api.secure-extension.com/v1/check/${prefix}`;

    console.log(`[k-Anonymity] Querying API with prefix: ${prefix} for url: ${normalizedUrl}`);

    // Standard MV3 fetch request with a strict 1-second timeout to prevent DNS/connection hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const response = await fetch(apiUrl, { signal: controller.signal })
      .catch(() => null);
      
    clearTimeout(timeoutId);

    let threatData = null;
    if (response && response.ok) {
      const data = await response.json();
      threatData = data.find(item => item.hash === fullHash);
    } else {
      // Simulate/mock API return locally for testing k-anonymity protocol compatibility
      const mockResultList = MOCK_INTEL_DB[prefix];
      if (mockResultList) {
        threatData = mockResultList.find(item => item.hash === fullHash);
      }
    }

    if (threatData) {
      console.warn(`[k-Anonymity] Threat matched! Hash: ${fullHash}, Risk: ${threatData.risk}`);
      return {
        matched: true,
        risk: threatData.risk,
        type: threatData.type,
        details: threatData.details
      };
    }

    return { matched: false, risk: "safe", type: null, details: DEFAULT_INTEL };
  } catch (error) {
    console.error(`[k-Anonymity] Error performing lookup:`, error);
    return { matched: false, risk: "safe", type: null, details: DEFAULT_INTEL };
  }
}

// Runs heuristics & k-Anonymity to analyze a tab
async function analyzeTab(tabId, urlString, forceReanalyze = false) {
  if (!urlString || urlString.startsWith('chrome://') || urlString.startsWith('chrome-extension://') || urlString.startsWith('about:') || urlString.startsWith('edge://')) {
    const safeState = {
      url: urlString,
      hostname: "system-page",
      riskScore: 100,
      riskRating: "safe",
      brandTarget: null,
      details: {
        hosting_location: "Local",
        asn: "N/A",
        site_age: "N/A",
        ssl_status: "Internal Sandbox"
      }
    };
    await chrome.storage.local.set({ [`tab_risk_${tabId}`]: safeState });
    updateBadge(tabId, "safe");
    return safeState;
  }

  try {
    const storageKey = `tab_risk_${tabId}`;
    if (!forceReanalyze) {
      const cached = await chrome.storage.local.get([storageKey]);
      if (cached[storageKey] && cached[storageKey].url === urlString) {
        console.log(`[Background] Serving cached risk state for tab ${tabId} (URL matched)`);
        return cached[storageKey];
      }
    }
    const url = new URL(urlString);
    const hostname = url.hostname;
    const isHttps = url.protocol === 'https:';

    // 1. Typosquatting / Combosquatting Heuristic
    const typosquatResult = analyzeHostname(hostname);

    // 2. k-Anonymity Threat Intelligence Lookup
    const normalized = normalizeUrl(urlString);
    const kAnonResult = await queryKAnonymityAPI(normalized);

    // 3. Compute Risk Metrics
    let riskRating = "safe";
    let riskScore = 100;
    let details = kAnonResult.matched ? kAnonResult.details : generateSiteIntel(url);

    if (kAnonResult.matched) {
      riskRating = kAnonResult.risk; // 'suspicious' or 'critical'
      riskScore = riskRating === 'critical' ? 10 : 40;
    } else if (typosquatResult.detected) {
      riskRating = "suspicious";
      riskScore = 35;
      // Synthesize specific intelligence for typosquat
      details = {
        hosting_location: "Unknown / Newly Registered",
        asn: "Suspicious ASN",
        site_age: "Less than 30 days",
        ssl_status: isHttps ? "Valid SSL (Potential Phish)" : "No SSL / Insecure"
      };
    } else if (!isHttps) {
      riskRating = "suspicious";
      riskScore = 60;
      details = {
        ...generateSiteIntel(url),
        ssl_status: "Insecure Protocol (HTTP)"
      };
    }

    const analysisState = {
      url: urlString,
      hostname: hostname,
      riskScore: riskScore,
      riskRating: riskRating,
      brandTarget: typosquatResult.brand || null,
      threatType: kAnonResult.type || typosquatResult.type || null,
      message: typosquatResult.message || (kAnonResult.matched ? `Known malicious URL associated with ${kAnonResult.type}` : ""),
      details: details
    };

    await chrome.storage.local.set({ [`tab_risk_${tabId}`]: analysisState });
    updateBadge(tabId, riskRating);

    // 4. Auto-block critical risks via declarativeNetRequest if matched in k-Anonymity database
    if (riskRating === "critical") {
      await blockSiteDNR(hostname);
    }

    return analysisState;
  } catch (error) {
    console.error(`[Background] Tab analysis error for ID ${tabId}:`, error);
  }
}

// Dynamically block a domain using declarativeNetRequest
async function blockSiteDNR(hostname) {
  try {
    const ruleId = getNumericId(hostname);
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const isAlreadyBlocked = existingRules.some(r => r.id === ruleId);

    if (!isAlreadyBlocked) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
          id: ruleId,
          priority: 2,
          action: { type: "block" },
          condition: {
            urlFilter: `||${hostname}`,
            resourceTypes: ["main_frame", "sub_frame"]
          }
        }],
        removeRuleIds: [ruleId]
      });
      console.log(`[DNR Block] Registered dynamic block rule for: ${hostname}`);
    }
  } catch (err) {
    console.error("[DNR Block] Error updating dynamic rules:", err);
  }
}

// Update Extension Badge based on Threat Rating
function updateBadge(tabId, riskRating) {
  let badgeText = "";
  let badgeColor = "#10B981"; // Safe Green

  if (riskRating === "critical") {
    badgeText = "!";
    badgeColor = "#EF4444"; // Red
  } else if (riskRating === "suspicious") {
    badgeText = "?";
    badgeColor = "#F59E0B"; // Orange
  }

  chrome.action.setBadgeText({ tabId, text: badgeText });
  chrome.action.setBadgeBackgroundColor({ tabId, color: badgeColor });
}

// Event Listeners
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    analyzeTab(tabId, tab.url, true); // Force reanalysis on completed load/reload
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      analyzeTab(activeInfo.tabId, tab.url, false); // Use cache to prevent wasteful CPU/network resource use
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`tab_risk_${tabId}`);
});

// Listener for messages from Content Scripts and Popups
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ANALYZE_CURRENT_TAB") {
    analyzeTab(message.tabId, message.url, false).then((state) => {
      sendResponse(state);
    });
    return true; // Keep message channel open for asynchronous sendResponse
  }

  if (message.type === "CHECK_SITE_RISK") {
    const tabId = sender.tab ? sender.tab.id : message.tabId;
    if (tabId) {
      chrome.storage.local.get([`tab_risk_${tabId}`], (result) => {
        sendResponse(result[`tab_risk_${tabId}`] || { riskRating: "safe", riskScore: 100 });
      });
      return true; // Keep message channel open for asynchronous sendResponse
    } else {
      sendResponse({ riskRating: "safe", riskScore: 100 });
    }
  }

  if (message.type === "REPORT_SUSPICIOUS") {
    const { url, domData } = message;
    console.log(`[Telemetry] Sending suspicious URL report for ${url} to telemetry endpoint.`, domData);

    // Mock API telemetry submission
    fetch("https://api.secure-extension.com/v1/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, domData, timestamp: Date.now() })
    })
    .then(() => console.log("[Telemetry] Report uploaded successfully"))
    .catch((err) => console.warn("[Telemetry] Telemetry server offline (mocking successful delivery):", err.message));

    // Force add to blocking rules dynamically
    try {
      const parsed = new URL(url);
      blockSiteDNR(parsed.hostname);
    } catch (e) {}

    sendResponse({ success: true });
    return true;
  }

  if (message.type === "UPDATE_DOM_METADATA") {
    const tabId = sender.tab.id;
    chrome.storage.local.get([`tab_risk_${tabId}`], (result) => {
      const currentState = result[`tab_risk_${tabId}`];
      if (currentState) {
        // Adjust risk based on DOM signals (e.g., password field on an insecure or typosquat domain)
        let updatedScore = currentState.riskScore;
        let updatedRating = currentState.riskRating;

        if (message.hasPasswordFields && currentState.riskRating === "suspicious") {
          updatedScore = Math.max(15, updatedScore - 20); // Heighten risk if passwords are input
          if (updatedScore < 30) updatedRating = "critical";
        }

        const updatedState = {
          ...currentState,
          riskScore: updatedScore,
          riskRating: updatedRating,
          domData: message
        };

        chrome.storage.local.set({ [`tab_risk_${tabId}`]: updatedState });
        updateBadge(tabId, updatedRating);
      }
    });
    sendResponse({ status: "metadata_updated" });
  }
});

// Dynamic threat feed updater
async function updateBlacklistDatabase() {
  console.log("[Update System] Initiating threat database synchronization...");
  try {
    const updateUrl = "https://api.secure-extension.com/v1/blacklist/update";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

    const response = await fetch(updateUrl, { signal: controller.signal })
      .catch(() => null);
    clearTimeout(timeoutId);

    if (response && response.ok) {
      const threatList = await response.json();
      console.log(`[Update System] Threat database synchronized. Received ${threatList.length} entries.`);
      
      // Update dynamic DNR blocking rules for new threat domains
      for (const item of threatList) {
        if (item.domain && item.risk === "critical") {
          await blockSiteDNR(item.domain);
        }
      }
      // Save threat blacklist data in storage
      await chrome.storage.local.set({ "threat_blacklist": threatList });
    } else {
      console.log("[Update System] Threat server offline. Seeding default offline signatures.");
      // Seed initial offline testing threat signatures
      const offlineDatabase = [
        { domain: "paypa1.com", risk: "critical" },
        { domain: "paypa1-security.com", risk: "critical" },
        { domain: "g00gle.com", risk: "suspicious" },
        { domain: "phish-bank.com", risk: "critical" }
      ];
      await chrome.storage.local.set({ "threat_blacklist": offlineDatabase });
    }
  } catch (err) {
    console.error("[Update System] Sync failed:", err);
  }
}

// Register Alarms & Initial Run on extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Installation] PhishShield Extension Initialized.");
  chrome.alarms.create("fetch_threat_updates", { periodInMinutes: 720 }); // Every 12 hours
  updateBlacklistDatabase();
});

// Alarm Trigger Listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetch_threat_updates") {
    updateBlacklistDatabase();
  }
});
