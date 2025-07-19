// Loom Blocker Until Insertion
window.addEventListener('load', function() {
  console.log("Page fully loaded. Searching for Finsweet tabs component...");

  const tabsComponent = document.querySelector('[fs-list-element="tabs"]');

  if (!tabsComponent) {
    console.error("Finsweet Tabs Component '[fs-list-element=\"tabs\"]' not found. Please check your v2 setup.");
    return;
  }
  
  console.log("Finsweet Tabs Component found. Initializing video loader.");

  const activateIframeInActivePane = () => {
    // Target the currently active tab pane
    const activePane = tabsComponent.querySelector('.w-tab-pane.w--tab-active');
    
    if (activePane) {
      const inertIframe = activePane.querySelector('iframe[data-src]:not([src])');
      
      if (inertIframe) {
        const videoUrl = inertIframe.dataset.src;
        inertIframe.setAttribute('src', videoUrl);
        console.log('Video activated:', videoUrl);
      }
    }
  };

  // Set up click listeners for tab navigation
  const setupTabListeners = () => {
    const tabLinks = tabsComponent.querySelectorAll('.w-tab-link');
    tabLinks.forEach(tabLink => {
      if (!tabLink.hasVideoListener) {
        tabLink.addEventListener('click', () => {
          setTimeout(activateIframeInActivePane, 150);
        });
        tabLink.hasVideoListener = true;
      }
    });
  };

  // Initial setup
  setupTabListeners();

  // Watch for dynamic changes from List Tabs
  const observer = new MutationObserver(() => {
    setupTabListeners();
    activateIframeInActivePane();
  });

  observer.observe(tabsComponent, { childList: true, subtree: true });
  
  // Activate initial iframe
  activateIframeInActivePane();
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