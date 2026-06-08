document.addEventListener('DOMContentLoaded', async () => {
  const progressCircle = document.getElementById('progress-circle');
  const scoreText = document.getElementById('score-text');
  const statusPill = document.getElementById('status-pill');
  const statusMessage = document.getElementById('status-message');
  
  const intelLocation = document.getElementById('intel-location');
  const intelAsn = document.getElementById('intel-asn');
  const intelAge = document.getElementById('intel-age');
  const intelSsl = document.getElementById('intel-ssl');
  
  const btnReport = document.getElementById('btn-report');
  const intelCard = document.querySelector('.bg-gray-900.bg-opacity-40');

  const CIRCUMFERENCE = 238.76; // 2 * pi * r (r=38)

  // Fetch active tab information
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const storageKey = `tab_risk_${tab.id}`;

  // Read analysis state from local storage
  chrome.storage.local.get([storageKey], (result) => {
    const state = result[storageKey];
    if (state) {
      renderDashboard(state);
    } else {
      // Fallback state if page hasn't finished analyzing yet
      renderDefaultLoading(tab.url);

      // Trigger immediate on-demand analysis for the current page
      chrome.runtime.sendMessage({
        type: "ANALYZE_CURRENT_TAB",
        tabId: tab.id,
        url: tab.url
      }, (response) => {
        if (response) {
          renderDashboard(response);
        }
      });
    }
  });

  // Render the dashboard with active analysis details
  function renderDashboard(state) {
    const { riskScore, riskRating, message, details } = state;

    // 1. Animate Circular Progress
    const offset = CIRCUMFERENCE - (riskScore / 100) * CIRCUMFERENCE;
    progressCircle.style.strokeDashoffset = offset;

    // Set Circle Color based on score
    if (riskRating === 'critical') {
      progressCircle.style.stroke = '#ef4444'; // Red
      progressCircle.style.filter = 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.45))';
      if (intelCard) {
        intelCard.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.15)';
        intelCard.style.borderColor = 'rgba(239, 68, 68, 0.25)';
      }
      statusPill.className = 'status-pill status-pill-critical';
      statusPill.textContent = 'Critical Risk';
      statusMessage.textContent = message || 'Known threat or severe typosquatting detected. Leave this site immediately.';
    } else if (riskRating === 'suspicious') {
      progressCircle.style.stroke = '#f59e0b'; // Orange
      progressCircle.style.filter = 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.45))';
      if (intelCard) {
        intelCard.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.15)';
        intelCard.style.borderColor = 'rgba(245, 158, 11, 0.25)';
      }
      statusPill.className = 'status-pill status-pill-suspicious';
      statusPill.textContent = 'Suspicious';
      statusMessage.textContent = message || 'Potential typosquatting, HTTP connection, or brand mismatch detected.';
    } else {
      progressCircle.style.stroke = '#10b981'; // Green
      progressCircle.style.filter = 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.4))';
      if (intelCard) {
        intelCard.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.1)';
        intelCard.style.borderColor = 'rgba(16, 185, 129, 0.2)';
      }
      statusPill.className = 'status-pill status-pill-safe';
      statusPill.textContent = 'Safe Site';
      statusMessage.textContent = 'This website matches secure reputational profiles and is safe to use.';
    }

    animateScore(riskScore);

    // 2. Populate Site Intelligence
    intelLocation.textContent = details?.hosting_location || 'Unknown';
    intelAsn.textContent = details?.asn || 'Unknown';
    intelAsn.title = details?.asn || '';
    intelAge.textContent = details?.site_age || 'Unknown';
    intelSsl.textContent = details?.ssl_status || 'Insecure';

    // If SSL is secure, color it green, else red
    if (details?.ssl_status?.includes('Secure') || details?.ssl_status?.includes('Internal')) {
      intelSsl.style.color = '#34d399';
    } else {
      intelSsl.style.color = '#f87171';
    }

    // Trigger smooth fade-in animations on the rows
    document.body.classList.add('loaded');
  }

  // Fallback default state while loading
  function renderDefaultLoading(url) {
    document.body.classList.remove('loaded');
    
    let host = 'Site';
    try {
      host = new URL(url).hostname;
    } catch(e){}

    progressCircle.style.strokeDashoffset = CIRCUMFERENCE;
    progressCircle.style.stroke = '#9ca3af';
    scoreText.textContent = '--';
    
    statusPill.className = 'status-pill';
    statusPill.textContent = 'Loading...';
    statusPill.style.backgroundColor = '';
    statusPill.style.color = '';
    
    statusMessage.textContent = `Analyzing risk telemetry for ${host}...`;
  }

  // Report Site Action
  btnReport.addEventListener('click', async () => {
    btnReport.disabled = true;
    const originalContent = btnReport.innerHTML;
    
    btnReport.innerHTML = `
      <svg class="animate-spin w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Reporting...</span>
    `;

    // Retrieve full telemetry from storage to submit
    chrome.storage.local.get([storageKey], (result) => {
      const state = result[storageKey] || {};
      
      chrome.runtime.sendMessage({
        type: "REPORT_SUSPICIOUS",
        url: tab.url,
        domData: state.domData || {}
      }, (response) => {
        if (response && response.success) {
          // Success Feedback
          btnReport.innerHTML = `
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Report Submitted</span>
          `;
          btnReport.style.borderColor = '#10b981';
          btnReport.style.color = '#34d399';
          btnReport.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';

          // Alert background rules to block it immediately on this client
          // (The background already intercept this and blocks it dynamically)
          setTimeout(() => {
            // Force reload active tab after blocking rules update to show browser block
            chrome.tabs.reload(tab.id);
            window.close();
          }, 1500);

        } else {
          // Fail Feedback
          btnReport.innerHTML = `<span>Report Failed</span>`;
          btnReport.disabled = false;
          setTimeout(() => {
            btnReport.innerHTML = originalContent;
          }, 2000);
        }
      });
    });
  });

  // Numerical count-up animation synced with SVG transition
  function animateScore(targetScore) {
    let current = 0;
    const duration = 1200; // 1.2s to match the CSS cubic-bezier progress stroke transition
    const startTime = performance.now();
    
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Exponential ease-out equation (ultra smooth speed curve)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      current = Math.round(easeProgress * targetScore);
      
      scoreText.textContent = `${current}%`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
});
