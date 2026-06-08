// Top 100 most impersonated brands and their primary domains
export const IMPERSONATED_BRANDS = [
  { brand: "Google", domain: "google.com", sld: "google" },
  { brand: "PayPal", domain: "paypal.com", sld: "paypal" },
  { brand: "Microsoft", domain: "microsoft.com", sld: "microsoft" },
  { brand: "Apple", domain: "apple.com", sld: "apple" },
  { brand: "Amazon", domain: "amazon.com", sld: "amazon" },
  { brand: "Netflix", domain: "netflix.com", sld: "netflix" },
  { brand: "Facebook", domain: "facebook.com", sld: "facebook" },
  { brand: "Instagram", domain: "instagram.com", sld: "instagram" },
  { brand: "Twitter", domain: "twitter.com", sld: "twitter" },
  { brand: "LinkedIn", domain: "linkedin.com", sld: "linkedin" },
  { brand: "GitHub", domain: "github.com", sld: "github" },
  { brand: "Reddit", domain: "reddit.com", sld: "reddit" },
  { brand: "eBay", domain: "ebay.com", sld: "ebay" },
  { brand: "Walmart", domain: "walmart.com", sld: "walmart" },
  { brand: "Target", domain: "target.com", sld: "target" },
  { brand: "Chase", domain: "chase.com", sld: "chase" },
  { brand: "Bank of America", domain: "bankofamerica.com", sld: "bankofamerica" },
  { brand: "Wells Fargo", domain: "wellsfargo.com", sld: "wellsfargo" },
  { brand: "Citibank", domain: "citi.com", sld: "citi" },
  { brand: "American Express", domain: "americanexpress.com", sld: "americanexpress" },
  { brand: "Coinbase", domain: "coinbase.com", sld: "coinbase" },
  { brand: "Binance", domain: "binance.com", sld: "binance" },
  { brand: "Dropbox", domain: "dropbox.com", sld: "dropbox" },
  { brand: "Adobe", domain: "adobe.com", sld: "adobe" },
  { brand: "Salesforce", domain: "salesforce.com", sld: "salesforce" },
  { brand: "Spotify", domain: "spotify.com", sld: "spotify" },
  { brand: "Discord", domain: "discord.com", sld: "discord" },
  { brand: "TikTok", domain: "tiktok.com", sld: "tiktok" },
  { brand: "Snapchat", domain: "snapchat.com", sld: "snapchat" },
  { brand: "WhatsApp", domain: "whatsapp.com", sld: "whatsapp" },
  { brand: "Telegram", domain: "telegram.org", sld: "telegram" },
  { brand: "iCloud", domain: "icloud.com", sld: "icloud" },
  { brand: "Booking.com", domain: "booking.com", sld: "booking" },
  { brand: "Airbnb", domain: "airbnb.com", sld: "airbnb" },
  { brand: "Uber", domain: "uber.com", sld: "uber" },
  { brand: "Lyft", domain: "lyft.com", sld: "lyft" },
  { brand: "DocuSign", domain: "docusign.com", sld: "docusign" },
  { brand: "Zoom", domain: "zoom.us", sld: "zoom" },
  { brand: "Steam", domain: "steamcommunity.com", sld: "steamcommunity" },
  { brand: "Roblox", domain: "roblox.com", sld: "roblox" },
  { brand: "Twitch", domain: "twitch.tv", sld: "twitch" },
  { brand: "Epic Games", domain: "epicgames.com", sld: "epicgames" },
  { brand: "Yahoo", domain: "yahoo.com", sld: "yahoo" },
  { brand: "Outlook", domain: "outlook.com", sld: "outlook" },
  { brand: "Visa", domain: "visa.com", sld: "visa" },
  { brand: "Mastercard", domain: "mastercard.com", sld: "mastercard" },
  { brand: "Stripe", domain: "stripe.com", sld: "stripe" },
  { brand: "Slack", domain: "slack.com", sld: "slack" },
  { brand: "Pinterest", domain: "pinterest.com", sld: "pinterest" },
  { brand: "Tencent", domain: "tencent.com", sld: "tencent" },
  { brand: "Alibaba", domain: "alibaba.com", sld: "alibaba" },
  { brand: "AliExpress", domain: "aliexpress.com", sld: "aliexpress" },
  { brand: "eBay", domain: "ebay.com", sld: "ebay" },
  { brand: "FedEx", domain: "fedex.com", sld: "fedex" },
  { brand: "UPS", domain: "ups.com", sld: "ups" },
  { brand: "DHL", domain: "dhl.com", sld: "dhl" },
  { brand: "Wells Fargo", domain: "wellsfargo.com", sld: "wellsfargo" },
  { brand: "Capital One", domain: "capitalone.com", sld: "capitalone" },
  { brand: "HSBC", domain: "hsbc.com", sld: "hsbc" },
  { brand: "Barclays", domain: "barclays.com", sld: "barclays" },
  { brand: "Fidelity", domain: "fidelity.com", sld: "fidelity" },
  { brand: "Vanguard", domain: "vanguard.com", sld: "vanguard" },
  { brand: "Metamask", domain: "metamask.io", sld: "metamask" },
  { brand: "Kraken", domain: "kraken.com", sld: "kraken" },
  { brand: "Bittrex", domain: "bittrex.com", sld: "bittrex" },
  { brand: "KuCoin", domain: "kucoin.com", sld: "kucoin" },
  { brand: "BlockFi", domain: "blockfi.com", sld: "blockfi" },
  { brand: "Blockchain.com", domain: "blockchain.com", sld: "blockchain" },
  { brand: "OpenSea", domain: "opensea.io", sld: "opensea" },
  { brand: "AT&T", domain: "att.com", sld: "att" },
  { brand: "Verizon", domain: "verizon.com", sld: "verizon" },
  { brand: "T-Mobile", domain: "t-mobile.com", sld: "t-mobile" },
  { brand: "Comcast", domain: "comcast.com", sld: "comcast" },
  { brand: "Netflix", domain: "netflix.com", sld: "netflix" },
  { brand: "Hulu", domain: "hulu.com", sld: "hulu" },
  { brand: "Disney+", domain: "disneyplus.com", sld: "disneyplus" },
  { brand: "Apple iCloud", domain: "icloud.com", sld: "icloud" },
  { brand: "Dropbox", domain: "dropbox.com", sld: "dropbox" },
  { brand: "Box", domain: "box.com", sld: "box" },
  { brand: "WeTransfer", domain: "wetransfer.com", sld: "wetransfer" },
  { brand: "GoDaddy", domain: "godaddy.com", sld: "godaddy" },
  { brand: "Namecheap", domain: "namecheap.com", sld: "namecheap" },
  { brand: "Cloudflare", domain: "cloudflare.com", sld: "cloudflare" },
  { brand: "WordPress", domain: "wordpress.com", sld: "wordpress" },
  { brand: "Shopify", domain: "shopify.com", sld: "shopify" },
  { brand: "Squarespace", domain: "squarespace.com", sld: "squarespace" },
  { brand: "Wix", domain: "wix.com", sld: "wix" },
  { brand: "Heroku", domain: "heroku.com", sld: "heroku" },
  { brand: "AWS", domain: "amazon.com", sld: "aws" },
  { brand: "Azure", domain: "azure.com", sld: "azure" },
  { brand: "DigitalOcean", domain: "digitalocean.com", sld: "digitalocean" },
  { brand: "Slack", domain: "slack.com", sld: "slack" },
  { brand: "Asana", domain: "asana.com", sld: "asana" },
  { brand: "Trello", domain: "trello.com", sld: "trello" },
  { brand: "Jira", domain: "jira.com", sld: "jira" },
  { brand: "Zoom", domain: "zoom.us", sld: "zoom" },
  { brand: "TeamViewer", domain: "teamviewer.com", sld: "teamviewer" },
  { brand: "Skype", domain: "skype.com", sld: "skype" }
];

/**
 * Calculates the Levenshtein distance between two strings.
 * @param {string} a - The first string.
 * @param {string} b - The second string.
 * @returns {number} The Levenshtein distance.
 */
export function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Extracts the second-level domain (SLD) from a hostname.
 * Example: 'sub.paypal.com' -> 'paypal', 'paypal.co.uk' -> 'paypal'
 * @param {string} hostname - The hostname to inspect.
 * @returns {string} The extracted SLD.
 */
export function extractSld(hostname) {
  const parts = hostname.toLowerCase().split('.');
  if (parts.length <= 1) return hostname;

  // Simple check for multi-part TLDs like co.uk, com.br, net.au, etc.
  const commonDoubleTlds = ['co', 'com', 'net', 'org', 'gov', 'edu'];
  const tld1 = parts[parts.length - 1];
  const tld2 = parts[parts.length - 2];

  if (parts.length > 2 && commonDoubleTlds.includes(tld2)) {
    return parts[parts.length - 3];
  }
  return tld2;
}

/**
 * Validates whether the current hostname is a legitimate subdomain or root of a brand.
 * @param {string} hostname - The current hostname.
 * @param {string} brandDomain - The brand's legitimate domain.
 * @returns {boolean} True if legitimate, false if suspicious.
 */
export function isLegitimateDomain(hostname, brandDomain) {
  const cleanHost = hostname.toLowerCase();
  const cleanBrand = brandDomain.toLowerCase();
  return cleanHost === cleanBrand || cleanHost.endsWith('.' + cleanBrand);
}

/**
 * Inspects a hostname for typosquatting or brand combosquatting.
 * @param {string} hostname - The hostname to analyze (e.g. 'paypa1.com').
 * @returns {object} Threat analysis result.
 */
export function analyzeHostname(hostname) {
  const cleanHost = hostname.toLowerCase().replace(/^www\./, '');
  const sld = extractSld(cleanHost);

  for (const item of IMPERSONATED_BRANDS) {
    // 1. If it's a legitimate subdomain or domain of the brand, skip checking
    if (isLegitimateDomain(cleanHost, item.domain)) {
      return { detected: false, type: null, brand: item.brand, distance: 0 };
    }

    // 2. Exact match on SLD but different extension (TLD hijacking)
    // e.g. paypal.security, paypal-update.com (combosquatting)
    if (sld === item.sld) {
      return {
        detected: true,
        type: "tld_hijack",
        brand: item.brand,
        distance: 0,
        message: `Legitimate brand name '${item.brand}' registered on an unofficial domain extension.`
      };
    }

    // 3. Levenshtein check for typosquatting (distance 1 or 2)
    // e.g. paypa1, g00gle. (Restricted to distance 1 for short brands to avoid false positives)
    const distance = getLevenshteinDistance(sld, item.sld);
    const maxAllowedDistance = item.sld.length <= 3 ? 1 : 2;
    if (distance >= 1 && distance <= maxAllowedDistance) {
      return {
        detected: true,
        type: "typosquat",
        brand: item.brand,
        distance: distance,
        message: `Possible typosquatting targeting '${item.brand}' (similarity: ${distance} edit).`
      };
    }

    // 4. Check for combosquatting / brand prefixing/suffixing
    // e.g. secure-paypal.com, paypal-login-support.com
    // Only flag if SLD is longer and contains the target brand sld
    if (sld.length > item.sld.length && (sld.startsWith(item.sld + '-') || sld.endsWith('-' + item.sld) || sld.includes('-' + item.sld + '-'))) {
      return {
        detected: true,
        type: "combosquat",
        brand: item.brand,
        distance: null,
        message: `Combosquatting detected: domain contains brand name '${item.brand}' in suspicious context.`
      };
    }
  }

  return { detected: false, type: null, brand: null, distance: null };
}
