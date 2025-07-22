// Function to pause a Loom iframe
function pauseLoomIframe(iframe) {
  if (!iframe) return;
  console.log('Pausing iframe:', iframe);
  iframe.contentWindow.postMessage(
    { method: 'pause', context: 'player.js' },
    '*'
  );
}

function setupTabPauseListeners() {
  const tabsComponent = document.querySelector('[fs-list-element="tabs"]');
  if (!tabsComponent) return;

  const tabLinks = tabsComponent.querySelectorAll('.w-tab-link');
  tabLinks.forEach(tabLink => {
    if (!tabLink.hasPauseListener) {
      tabLink.addEventListener('click', function() {
        const activeSlug = tabLink.getAttribute('data-video-tab-link');
        console.log('Tab clicked, activeSlug:', activeSlug);
        document.querySelectorAll('iframe[data-video-tab-iframe]').forEach(function(iframe) {
          const videoSlug = iframe.getAttribute('data-video-tab-iframe');
          console.log('Comparing videoSlug:', videoSlug, 'to activeSlug:', activeSlug);
          if (videoSlug !== activeSlug) {
            pauseLoomIframe(iframe);
          }
        });
      });
      tabLink.hasPauseListener = true;
    }
  });
}

// Use MutationObserver to watch for tab link changes
window.addEventListener('load', function() {
  function observeTabs() {
    const tabsComponent = document.querySelector('[fs-list-element="tabs"]');
    if (!tabsComponent) {
      setTimeout(observeTabs, 200);
      return;
    }
    setupTabPauseListeners();

    const observer = new MutationObserver(() => {
      setupTabPauseListeners();
    });

    observer.observe(tabsComponent, { childList: true, subtree: true });
  }
  observeTabs();
}); 