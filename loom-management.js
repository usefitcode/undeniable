// Only run this script on the staging domain
if (window.location.hostname !== 'becomeundeniable.webflow.io') {
  // Exit if not on staging
  return;
}

// Helper to create a Loom iframe
function createLoomIframe(loomUrl) {
  const iframe = document.createElement('iframe');
  iframe.src = loomUrl;
  iframe.width = "100%";
  iframe.height = "400"; // Adjust as needed
  iframe.frameBorder = "0";
  iframe.allow = "autoplay; fullscreen";
  iframe.setAttribute("allowfullscreen", "");
  return iframe;
}

// Activate Loom in the currently active tab pane
function activateLoomInActivePane() {
  const tabsComponent = document.querySelector('[fs-list-element="tabs"]');
  if (!tabsComponent) return;
  const activePane = tabsComponent.querySelector('.w-tab-pane.w--tab-active');
  if (!activePane) return;

  // Remove all Loom iframes from all panes
  tabsComponent.querySelectorAll('iframe').forEach(iframe => {
    pauseLoomIframe(iframe);
    iframe.remove();
  });

  // Find the video embed container in the active pane
  const videoEmbedDiv = activePane.querySelector('div[data-element="video-embed"]');
  if (videoEmbedDiv) {
    // Try to get the Loom URL from the iframe's src attribute
    const existingIframe = videoEmbedDiv.querySelector('iframe[src]');
    let loomUrl = existingIframe ? existingIframe.getAttribute('src') : null;
    if (loomUrl && loomUrl.startsWith('@')) {
      loomUrl = loomUrl.slice(1); // Remove leading '@'
    }
    if (loomUrl && loomUrl.startsWith('https://www.loom.com/embed/')) {
      videoEmbedDiv.innerHTML = '';
      const iframe = createLoomIframe(loomUrl);
      videoEmbedDiv.appendChild(iframe);
    } else {
      // Optionally, show a placeholder or message
      videoEmbedDiv.innerHTML = '<div style="text-align:center;color:#888;">Video coming soon</div>';
    }
  }
}

// Set up click listeners for tab navigation
function setupTabListeners() {
  const tabsComponent = document.querySelector('[fs-list-element="tabs"]');
  if (!tabsComponent) return;
  const tabLinks = tabsComponent.querySelectorAll('.w-tab-link');
  tabLinks.forEach(tabLink => {
    if (!tabLink.hasLoomListener) {
      tabLink.addEventListener('click', () => {
        setTimeout(activateLoomInActivePane, 150);
      });
      tabLink.hasLoomListener = true;
    }
  });
}

// Wait for Finsweet to finish building the tabs using MutationObserver
window.addEventListener('load', function() {
  function initializeLoomTabManagement() {
    const tabsComponent = document.querySelector('[fs-list-element="tabs"]');
    if (!tabsComponent) return;
    setupTabListeners();
    activateLoomInActivePane();
  }

  // Observe for changes in the tab system
  const observer = new MutationObserver(() => {
    initializeLoomTabManagement();
  });

  // Wait for the tabs component to appear in the DOM
  function waitForTabsComponent() {
    const tabsComponent = document.querySelector('[fs-list-element="tabs"]');
    if (tabsComponent) {
      observer.observe(tabsComponent, { childList: true, subtree: true });
      initializeLoomTabManagement();
    } else {
      setTimeout(waitForTabsComponent, 200);
    }
  }

  waitForTabsComponent();
});

// Custom solution to pause the video when someone switches tabs
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'list', // or the specific solution name if different
  (listInstances) => {
    function pauseLoomIframe(iframe) {
      if (!iframe) return;
      iframe.contentWindow.postMessage(
        { method: 'pause', context: 'player.js' },
        '*'
      );
    }
    document.querySelectorAll('[data-video-tab-link]').forEach(function(tabLink) {
      tabLink.addEventListener('click', function() {
        var activeSlug = tabLink.getAttribute('data-video-tab-link');
        document.querySelectorAll('iframe[data-video-tab-iframe]').forEach(function(iframe) {
          var videoSlug = iframe.getAttribute('data-video-tab-iframe');
          if (videoSlug !== activeSlug) {
            pauseLoomIframe(iframe);
          }
        });
      });
    });
  }
]); 