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

  // ── Lightbox ──
  const $lightbox = $('#lightbox');
  const $lbImg    = $('#lightbox-img');
  const $lbCap    = $('#lightbox-caption');
  let lbItems = [];
  let lbIndex = 0;

  function lbShow(idx) {
    lbIndex = (idx + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    $lbImg.attr('src', item.src).attr('alt', item.caption);
    $lbCap.text(item.caption);
  }

  $(document).on('click', '.picture-thumb', function () {
    lbItems = [];
    $('.picture-thumb').each(function () {
      lbItems.push({ src: $(this).data('src'), caption: $(this).data('caption') });
    });
    const clicked = $(this).data('src');
    lbIndex = lbItems.findIndex(i => i.src === clicked);
    lbShow(lbIndex);
    $lightbox.addClass('open');
  });

  $('#lightbox-close, #lightbox').on('click', function (e) {
    if (e.target === this) $lightbox.removeClass('open');
  });
  $('#lightbox-prev').on('click', function (e) { e.stopPropagation(); lbShow(lbIndex - 1); });
  $('#lightbox-next').on('click', function (e) { e.stopPropagation(); lbShow(lbIndex + 1); });
  $(document).on('keydown', function (e) {
    if (!$lightbox.hasClass('open')) return;
    if (e.key === 'ArrowLeft')  lbShow(lbIndex - 1);
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    if (e.key === 'Escape')     $lightbox.removeClass('open');
  });

  // ── YouTube Viewer ──
  const $ytViewer = $('#yt-viewer');
  const $ytEmbed  = $('#yt-embed');
  const $ytCap    = $('#yt-caption');

  function ytClose() {
    $ytEmbed.empty();
    $ytViewer.removeClass('open');
  }

  $(document).on('click', '.video-thumb', function () {
    const vid = $(this).data('vid');
    const cap = $(this).data('caption');
    $ytEmbed.html('<iframe src="https://www.youtube.com/embed/' + vid + '?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
    $ytCap.text(cap);
    $ytViewer.addClass('open');
  });

  $('#yt-close').on('click', function () { ytClose(); });
  $('#yt-viewer').on('click', function (e) { if (e.target === this) ytClose(); });
  $(document).on('keydown', function (e) {
    if ($ytViewer.hasClass('open') && e.key === 'Escape') ytClose();
  });

  // ── Play button toggle ──
  let playing = false;
  $('#play-btn').on('click', function () {
    playing = !playing;
    $(this).text(playing ? '⏸' : '▶');
  });

});
