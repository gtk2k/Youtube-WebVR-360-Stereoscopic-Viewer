!function setYoutubePageContextScript() {
  function onYouTubePlayerReady(player) {
    var wdoYoutubePlayerReadyEvent = new CustomEvent('wdoYoutubePlayerReady', { detail: player });
    window.dispatchEvent(wdoYoutubePlayerReadyEvent);
    window.wdoYoutubePlayer = player;
    var flg = false;
    window.wdoYoutubePlayer.addEventListener("onStateChange", function (newState) {
      if (newState == -1 /*|| newState == 3*/) {
        flg = true;
      } else if (newState == 1 && flg) {
        updateQuality();
        flg = false;
      }
      window.dispatchEvent(new CustomEvent('wdoChangeStateYoutubePlayer', { detail: newState }));
    });
    updateQuality();

    window.addEventListener('wdoPlayYoutubePlayer', function (event) {
      window.wdoYoutubePlayer.playVideo();
    }, false);

    window.addEventListener('wdoPauseYoutubePlayer', function (event) {
      window.wdoYoutubePlayer.pauseVideo();
    }, false);

    window.addEventListener('wdoSeekYoutubePlayer', function (event) {
      window.wdoYoutubePlayer.seekTo(event.detail, true);
    }, false);

    window.addEventListener('wdoGetCurrentTimeYoutubePlayer', function (event) {
      window.dispatchEvent(new CustomEvent('wdoGetCurrentTimeYoutubePlayerResponse', { detail: window.wdoYoutubePlayer.getCurrentTime() }));
    }, false);
  }

  function updateQuality() {
    // ["hd1080", "hd720", "large", "medium", "small", "auto"]
    var aq = window.wdoYoutubePlayer.getAvailableQualityLevels();
    //var q = (aq.indexOf(quality) == -1) ? aq[0] : quality;
    window.wdoYoutubePlayer.setPlaybackQuality(aq[0]);
  }

  var srcCode = onYouTubePlayerReady.toString() + '; ' + updateQuality.toString();
  var script = document.createElement('script');
  script.textContent = srcCode;
  document.documentElement.appendChild(script);
}();
