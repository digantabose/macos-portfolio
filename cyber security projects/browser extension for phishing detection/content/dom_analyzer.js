// Content script for inspecting DOM elements and checking page characteristics.
(function() {
  let observer = null;

  function scanPageFeatures() {
    try {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      const allInputs = document.querySelectorAll('input');
      const forms = document.querySelectorAll('form');

      let hasPasswordFields = passwordInputs.length > 0;
      let hasCreditCardFields = false;

      // Credit card matching attributes
      const ccRegex = /card[-_]?number|cardNumber|card_num|cardnum|cvc|cvv|card[-_]?expiry|cc[-_]?exp|cc[-_]?num/i;

      for (const input of allInputs) {
        if (
          ccRegex.test(input.name || '') ||
          ccRegex.test(input.id || '') ||
          ccRegex.test(input.placeholder || '') ||
          ccRegex.test(input.autocomplete || '') ||
          (input.className && typeof input.className === 'string' && ccRegex.test(input.className))
        ) {
          hasCreditCardFields = true;
          break;
        }
      }

      // Check form action properties
      let hasInsecureFormAction = false;
      for (const form of forms) {
        const action = form.getAttribute('action');
        if (action && action.startsWith('http://')) {
          hasInsecureFormAction = true;
          break;
        }
      }

      // Send structural insights to service worker with context protection
      try {
        chrome.runtime.sendMessage({
          type: "UPDATE_DOM_METADATA",
          hasPasswordFields,
          hasCreditCardFields,
          hasInsecureFormAction,
          inputCount: allInputs.length,
          formCount: forms.length,
          title: document.title
        }, (response) => {
          if (chrome.runtime.lastError) {
            // Context invalidated (orphaned content script) - stop observer
            if (observer) observer.disconnect();
          }
        });
      } catch (err) {
        // Disconnect observer on exception
        if (observer) observer.disconnect();
      }

    } catch (error) {
      console.error("[PhishShield Analyzer] Error scanning DOM:", error);
    }
  }

  // Scan initially when script loads (run_at is document_end)
  scanPageFeatures();

  // Watch for dynamic DOM changes (e.g. login dialog popping up)
  let scanTimeout = null;
  observer = new MutationObserver(() => {
    if (scanTimeout) clearTimeout(scanTimeout);
    scanTimeout = setTimeout(scanPageFeatures, 1000); // Debounce scans
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
