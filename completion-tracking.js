// Completion Tracking Script + Play/Complete Buttons
document.addEventListener("DOMContentLoaded", () => {
  if (!window.$memberstackDom) {
    console.error('Memberstack not found!');
    return;
  }
  
  setTimeout(async () => {
    const buttons = document.querySelectorAll('.mark-complete-btn');
    const progressText = document.querySelector('[data-progress-element="text"]');
    const progressBar = document.querySelector('[data-progress-element="bar"]');
    const iconContainers = document.querySelectorAll('[data-icon-container]');
    const totalCount = buttons.length;

    function updateProgress(completedData) {
      const completedCount = Array.from(buttons).filter(btn => {
        const { videoId, phaseId } = btn.dataset;
        return completedData[phaseId]?.includes(videoId);
      }).length;

      if (progressText) progressText.textContent = `${completedCount}/${totalCount}`;
      if (progressBar) {
        const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        progressBar.style.width = percentage + '%';
      }
    }

    function updateIcons(completedData) {
      iconContainers.forEach(container => {
        const { videoId, phaseId } = container.dataset;
        if (!videoId || !phaseId) return;
        
        const playIcon = container.querySelector('img[data-icon="play"]');
        const checkIcon = container.querySelector('img[data-icon="check"]');
        if (!playIcon || !checkIcon) return;
        
        const isCompleted = completedData[phaseId]?.includes(videoId);
        playIcon.style.display = isCompleted ? 'none' : 'block';
        checkIcon.style.display = isCompleted ? 'block' : 'none';
      });
    }

    try {
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (!member) return;
      
      let { data: memberJson = {} } = await window.$memberstackDom.getMemberJSON();
      memberJson.completedContent = memberJson.completedContent || {};
      
      // Initialize UI - buttons and icons
      buttons.forEach(btn => {
        const { videoId, phaseId } = btn.dataset;
        if (!videoId || !phaseId) return;
        
        const isCompleted = memberJson.completedContent[phaseId]?.includes(videoId);
        btn.textContent = isCompleted ? '☑️ Completed' : 'Mark Complete';
        btn.classList.toggle('is-completed', isCompleted);
      });
      
      updateProgress(memberJson.completedContent);
      updateIcons(memberJson.completedContent);

      // Add click handlers
      buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
          const { videoId, phaseId } = btn.dataset;
          if (!videoId || !phaseId) return;
          
          btn.disabled = true;
          
          const completedData = memberJson.completedContent;
          const isCompleted = completedData[phaseId]?.includes(videoId);
          
          if (isCompleted) {
            completedData[phaseId] = completedData[phaseId].filter(id => id !== videoId);
            btn.textContent = 'Mark Complete';
            btn.classList.remove('is-completed');
          } else {
            completedData[phaseId] = completedData[phaseId] || [];
            completedData[phaseId].push(videoId);
            btn.textContent = '☑️ Completed';
            btn.classList.add('is-completed');
          }

          try {
            await window.$memberstackDom.updateMemberJSON({ json: memberJson });
            updateProgress(completedData);
            updateIcons(completedData); // Update icons immediately
          } catch (err) {
            console.error("Update failed:", err);
            // Simple revert
            btn.textContent = isCompleted ? '☑️ Completed' : 'Mark Complete';
            btn.classList.toggle('is-completed', isCompleted);
          }
          
          btn.disabled = false;
        });
      });
      
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  }, 1000);
}); 