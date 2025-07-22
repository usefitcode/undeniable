// Only run this script on the staging domain
if (window.location.hostname !== 'becomeundeniable.webflow.io') {
  // Exit if not on staging
  return;
}

// Function to pause a Loom iframe
function pauseLoomIframe(iframe) {
  if (!iframe) return;
  console.log('Pausing iframe:', iframe);
  iframe.contentWindow.postMessage(
    { method: 'pause', context: 'player.js' },
    '*'
  );
}

window.addEventListener('load', function() {
  // Find the Finsweet tabs component
  const tabsComponent = document.querySelector('[fs-list-element="tabs"]');
  if (!tabsComponent) return;

  // Set up click listeners for tab navigation
  const tabLinks = tabsComponent.querySelectorAll('.w-tab-link');
  tabLinks.forEach(tabLink => {
    if (!tabLink.hasPauseListener) {
      tabLink.addEventListener('click', function() {
        // Get the slug for the tab being activated
        const activeSlug = tabLink.getAttribute('data-video-tab-link');
        console.log('Tab clicked, activeSlug:', activeSlug);
        // Pause all Loom iframes except the one for the active tab
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
}); 