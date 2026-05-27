document.addEventListener('DOMContentLoaded', function() {
  var announcementModal = document.getElementById('modal-announcement');

  if (announcementModal && !localStorage.getItem('announcementDismissed')) {
    MicroModal.show('modal-announcement', {
      onClose: function() {
        localStorage.setItem('announcementDismissed', '1');
      },
      disableFocus: true
    });
  }

  document.addEventListener('change', function(event) {
    if (event.target.id !== 'announcement-decline-check') return;

    var content = document.getElementById('modal-announcement-content');
    if (!content) return;

    content.innerHTML =
      '<div class="announcement-declined">' +
      '<p>Your response has been recorded. Please wait five seconds for admission to the site.</p>' +
      '<p class="announcement-countdown" id="announcement-countdown-num">5</p>' +
      '</div>';

    var count = 5;
    var countEl = document.getElementById('announcement-countdown-num');
    var interval = setInterval(function() {
      count--;
      if (!countEl) { clearInterval(interval); return; }
      if (count > 0) {
        countEl.textContent = count;
      } else {
        clearInterval(interval);
        countEl.textContent = '';
        countEl.className = 'announcement-granted';
        countEl.textContent = 'Admission granted.';
        setTimeout(function() {
          MicroModal.close('modal-announcement');
        }, 800);
      }
    }, 1000);
  });

  document.addEventListener('change', function(event) {
    if (event.target.id !== 'announcement-interest-check') return;

    var postTitle = event.target.getAttribute('data-post-title');
    var postUrl = event.target.getAttribute('data-post-url');

    if (typeof umami !== 'undefined') {
      umami.track('announcement-interest', { title: postTitle });
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'form-name': 'announcement-interest',
        'post-title': postTitle,
        'post-url': postUrl
      }).toString()
    }).catch(function() {});

    localStorage.setItem('announcementDismissed', '1');
    MicroModal.close('modal-announcement');
  });
});
