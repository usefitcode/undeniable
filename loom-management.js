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

// Wait for Finsweet to build the tabs, then attach listeners
window.addEventListener('load', function() {
  function trySetup() {
    const tabsComponent = document.querySelector('[fs-list-element="tabs"]');
    if (tabsComponent && tabsComponent.querySelectorAll('.w-tab-link').length > 0) {
      setupTabPauseListeners();
    } else {
      setTimeout(trySetup, 200);
    }
  }
  trySetup();
}); 