$(function () {

  let zTop = 1001;

  // ── Make all windows draggable + resizable ──
  $('.mac-window').each(function () {
    $(this).draggable({
      handle: '.window-titlebar',
      containment: 'body',
      start: function () { bringToFront($(this)); }
    }).resizable({
      handles: 'se, s, e',
      minWidth: 280,
      minHeight: 160
    });
  });

  function bringToFront($win) {
    zTop++;
    $win.css('z-index', zTop);
  }

  // ── Open windows on icon / dock double-click ──
  function openWindow(id) {
    const $win = $('#win-' + id);
    if ($win.length === 0) return;

    if ($win.is(':visible')) {
      bringToFront($win);
      $win.effect('bounce', { times: 2, distance: 6 }, 300);
    } else {
      bringToFront($win);
      $win.fadeIn(180);
    }
  }

  // Desktop icons — double-click
  $('.desktop-icon').on('dblclick', function () {
    openWindow($(this).data('window'));
  });
  // Desktop icons — single tap on touch
  $('.desktop-icon').on('click', function () {
    openWindow($(this).data('window'));
  });

  // Dock items — single click
  $('.dock-item').on('click', function () {
    openWindow($(this).data('window'));
  });

  // ── Close button ──
  $(document).on('click', '.tl-close', function () {
    $('#' + $(this).data('close')).fadeOut(160);
  });

  // ── Bring to front on click ──
  $(document).on('mousedown', '.mac-window', function () {
    bringToFront($(this));
  });

  // ── Clock ──
  function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    $('#clock').text(h + ':' + m);
  }
  updateClock();
  setInterval(updateClock, 10000);

  // ── Play button toggle ──
  let playing = false;
  $('#play-btn').on('click', function () {
    playing = !playing;
    $(this).text(playing ? '⏸' : '▶');
  });

});
