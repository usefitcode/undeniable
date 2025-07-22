// Function to pause a Loom iframe
function pauseLoomIframe(iframe) {
  if (!iframe) return;
  iframe.contentWindow.postMessage(
    { method: 'pause', context: 'player.js' },
    '*'
  );
}

function pauseInactiveLoomVideos() {
  // Find the active tab's slug
  const activePane = document.querySelector('.w-tab-pane.w--tab-active');
  if (!activePane) return;
  // Find the active slug (from the iframe in the active pane)
  const activeIframe = activePane.querySelector('iframe[data-video-tab-iframe]');
  const activeSlug = activeIframe ? activeIframe.getAttribute('data-video-tab-iframe') : null;

  // Pause all Loom iframes except the one in the active pane
  document.querySelectorAll('iframe[data-video-tab-iframe]').forEach(function(iframe) {
    const videoSlug = iframe.getAttribute('data-video-tab-iframe');
    if (videoSlug !== activeSlug) {
      pauseLoomIframe(iframe);
    }
  });
}

// Observe for changes to the active tab pane
window.addEventListener('DOMContentLoaded', function() {
  const tabContent = document.querySelector('[fs-list-element="tabs"]');
  if (!tabContent) return;

  // Use a MutationObserver to watch for class changes (tab switches)
  const observer = new MutationObserver(() => {
    pauseInactiveLoomVideos();
  });

  observer.observe(tabContent, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  // Also run once on load
  pauseInactiveLoomVideos();
}); 