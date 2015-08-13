var youtubePlayer;

!function setYoutubePageContextScript() {
  function onYouTubePlayerReady(player) {
    var wdoYoutubePlayerReadyEvent = new CustomEvent('wdoYoutubePlayerReady', { detail: player });
    window.dispatchEvent(wdoYoutubePlayerReadyEvent);
    youtubePlayer = player;
    console.log(player.getVideoUrl());
    var vsrc = 'blob:' + escape(player.getVideoUrl());
    console.log(vsrc);
    var flg = false;
    youtubePlayer.addEventListener("onStateChange", function (newState) {
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
      youtubePlayer.playVideo();
    }, false);

    window.addEventListener('wdoPauseYoutubePlayer', function (event) {
      youtubePlayer.pauseVideo();
    }, false);

    window.addEventListener('wdoSeekYoutubePlayer', function (event) {
      youtubePlayer.seekTo(event.detail, true);
    }, false);

    window.addEventListener('wdoGetCurrentTimeYoutubePlayer', function (event) {
      window.dispatchEvent(new CustomEvent('wdoGetCurrentTimeYoutubePlayerResponse', { detail: youtubePlayer.getCurrentTime() }));
    }, false);
  }

  function updateQuality() {
    // ["hd1080", "hd720", "large", "medium", "small", "auto"]
    youtubePlayer.setPlaybackQuality(youtubePlayer.getAvailableQualityLevels()[0]);
  }

  var srcCode = onYouTubePlayerReady.toString() + '; ' + updateQuality.toString();
  var script = document.createElement('script');
  script.textContent = srcCode;
  document.documentElement.appendChild(script);
}();
