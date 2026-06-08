// Content script to prevent credential leaks on insecure/phishing pages.
(function() {
  let bypassActive = false;

  document.addEventListener('submit', function(event) {
    // If the user has clicked "Proceed anyway", bypass our block
    if (bypassActive) {
      bypassActive = false; // Reset flag for subsequent actions
      return; 
    }

    const form = event.target;
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    const allInputs = form.querySelectorAll('input');
    
    // Check if the form collects sensitive info
    let isSensitiveForm = passwordInputs.length > 0;
    const ccRegex = /card[-_]?number|cardNumber|card_num|cardnum|cvc|cvv|card[-_]?expiry|cc[-_]?exp|cc[-_]?num/i;

    if (!isSensitiveForm) {
      for (const input of allInputs) {
        if (ccRegex.test(input.name || '') || ccRegex.test(input.id || '') || ccRegex.test(input.placeholder || '')) {
          isSensitiveForm = true;
          break;
        }
      }
    }

    // If it's a standard form (no password/credit cards), let it pass
    if (!isSensitiveForm) return;

    // Prevent immediate submission to check threat database
    event.preventDefault();

    // Check protocol and fetch site risk rating from background service worker
    const isHttps = window.location.protocol === 'https:';
    
    try {
      chrome.runtime.sendMessage({ type: "CHECK_SITE_RISK" }, function(response) {
        if (chrome.runtime.lastError) {
          // Context invalidated (e.g. extension updated/reloaded) - fail open
          submitForm(form);
          return;
        }

        const riskRating = response ? response.riskRating : "safe";
        const brandTarget = response ? response.brandTarget : null;
        const threatType = response ? response.threatType : null;

        const isHighRisk = (riskRating === "critical" || riskRating === "suspicious");

        // Intercept if it's HTTP OR high-risk/suspicious
        if (!isHttps || isHighRisk) {
          let reason = "This webpage has been flagged as high risk for phishing or credential theft.";
          
          if (!isHttps && isHighRisk) {
            reason = `This page is insecure (HTTP) and has been flagged for ${threatType || "suspicious activities"}${brandTarget ? ` targeting ${brandTarget}` : ""}.`;
          } else if (!isHttps) {
            reason = "This connection is insecure (HTTP). Any passwords or credit card details you enter can be intercepted by eavesdroppers on your network.";
          } else if (isHighRisk) {
            reason = `This domain is flagged as ${riskRating.toUpperCase()} threat. Reason: ${threatType || "Phishing mimicry"}${brandTarget ? ` impersonating ${brandTarget}` : ""}.`;
          }

          showSecurityWarning(form, reason);
        } else {
          // Safe site and secure connection: proceed with submission
          submitForm(form);
        }
      });
    } catch (err) {
      // Messaging failed: fail-open
      submitForm(form);
    }
  }, true); // Use capture phase to ensure we intercept first

  // Safe programmatic submission helper preserving HTML5 constraints
  function submitForm(form) {
    bypassActive = true;
    if (typeof form.requestSubmit === 'function') {
      form.requestSubmit();
    } else {
      form.submit();
    }
  }

  // Renders a premium, isolated Shadow DOM warning modal on the page
  function showSecurityWarning(form, reasonText) {
    // Check if warning already exists
    if (document.getElementById('phishshield-warning-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'phishshield-warning-overlay';
    
    // Style the root wrapper for absolute coverage
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '2147483647', // Maximum z-index
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'auto'
    });

    // Create a Shadow Root to isolate warning styles from the webpage
    const shadowRoot = overlay.attachShadow({ mode: 'open' });

    // Styles for the shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(8, 10, 15, 0.85);
        backdrop-filter: blur(12px);
        transition: opacity 0.3s ease;
      }
      
      .modal {
        position: relative;
        background: linear-gradient(135deg, #161b26, #0e121a);
        border: 2px solid #ef4444;
        box-shadow: 0 0 30px rgba(239, 68, 68, 0.4), 0 10px 40px rgba(0, 0, 0, 0.8);
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        padding: 32px;
        color: #f3f4f6;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        text-align: center;
        animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes scaleIn {
        from { transform: scale(0.92); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      .icon-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.15);
        border: 2px solid #ef4444;
        color: #ef4444;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
        70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }

      .icon-container svg {
        width: 38px;
        height: 38px;
        fill: currentColor;
      }

      h1 {
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 12px 0;
        letter-spacing: -0.5px;
        color: #ffffff;
      }

      p.warning-title {
        color: #ef4444;
        font-weight: 600;
        margin-bottom: 16px;
        text-transform: uppercase;
        font-size: 13px;
        letter-spacing: 1.5px;
      }

      p.reason {
        font-size: 15px;
        line-height: 1.6;
        color: #9ca3af;
        margin: 0 0 28px 0;
      }

      .button-group {
        display: flex;
        gap: 16px;
        justify-content: center;
      }

      button {
        flex: 1;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }

      .btn-cancel {
        background: #ef4444;
        color: #ffffff;
      }

      .btn-cancel:hover {
        background: #dc2626;
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
      }

      .btn-proceed {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #d1d5db;
      }

      .btn-proceed:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
      }
    `;

    // Create the structure
    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="icon-container">
        <svg viewBox="0 0 24 24">
          <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z"/>
        </svg>
      </div>
      <p class="warning-title">Security Blocked</p>
      <h1>Potential Credential Leak</h1>
      <p class="reason">${reasonText}</p>
      <div class="button-group">
        <button class="btn-cancel" id="ps-btn-cancel">Go Back to Safety</button>
        <button class="btn-proceed" id="ps-btn-proceed">Proceed Anyway (Unsafe)</button>
      </div>
    `;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(backdrop);
    shadowRoot.appendChild(modal);

    document.body.appendChild(overlay);

    // Event listeners for action buttons
    shadowRoot.getElementById('ps-btn-cancel').addEventListener('click', function() {
      overlay.remove();
    });

    shadowRoot.getElementById('ps-btn-proceed').addEventListener('click', function() {
      overlay.remove();
      submitForm(form);
    });
  }
})();
