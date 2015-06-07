///<reference path="three.js"/>
///<reference path="UI.js"/>
///<reference path="PanoramaViewer.js"/>
///<reference path="MouseKeyboard.js"/>
///<reference path="YoutubePageContextScript.js"/>
///<reference path="chromeStorage.js"/>
///<reference path="constants.js"/>

var cvRafId;
var youtubePlayerState = 1;
var isEmbed = false;
var videoContainer, video, videoWidth, videoHeight, videoTitle = '';
var videoId;
var vrHMD, vrPositionSensor;

function getVRDevices() {
  return new Promise(function(resolve, reject){
    if (navigator.getVRDevices) {
      navigator.getVRDevices().then(function (devices) {
        for (var i = 0; i < devices.length; i++) {
          if (devices[i] instanceof HMDVRDevice) {
            vrHMD = devices[i];
            eyeFOVL = vrHMD.getEyeParameters('left');
            eyeFOVR = vrHMD.getEyeParameters('right');
            break;
          }
        }
        for (var i = 0; i < devices.length; i++) {
          if (devices[i] instanceof PositionSensorVRDevice) {
            vrPositionSensor = devices[i];
          }
        }
      }).then(function () {
        if (viewerInfo.isPanorama) {
          if (btnOculus) {
            btnOculus.style.display = vrHMD && vrHMD.deviceName !== 'Mockulus Rift' ? '' : 'none';
          }
        }
      });
    }
  });
}

window.addEventListener('wdoYoutubePlayerReady', function (event) {
  console.log('Youtube Player Ready');
  initViewer();
}, false);

window.addEventListener('wdoChangeStateYoutubePlayer', function (event) {
  console.log('state', event.detail);
  youtubePlayerState = event.detail;

  if (youtubePlayerState === -1) {
    initViewer();
  }

}, false);

window.addEventListener('wdoGetCurrentTimeYoutubePlayerResponse', function (event) {
  callback(event.detail);
}, false);

window.addEventListener('wdoOpenOculusWindowResponse', function (event) {
  //chrome.runtime.sendMessage({ action: ACTION_OPEN_OCULUS_WINDOW, mediaUrl: mediaUrl, currentTime: event.detail });
}, false);

window.addEventListener('wdoBeginCloseOculusWindowResponse', function (event) {
  //chrome.runtime.sendMessage({ action: ACTION_CLOSE_OCULUS_WINDOW, currentTime: event.detail });
}, false);

//function detectChangeVideo() {
//  //cvRafId = requestAnimationFrame(detectChangeVideo);
//  var title = document.getElementById('eow-title') || document.getElementsByClassName('html5-title-text')[0];
//  if (title && title.textContent !== videoTitle) {
//    initViewer();
//  }
//}

//if (!cvRafId) {
//  detectChangeVideo();
//}

!function initViewer() {
  isEmbed = location.href.indexOf('https://www.youtube.com/embed/') !== -1;
  var title = document.getElementById('eow-title') || document.getElementsByClassName('html5-title-text')[0];
  videoContainer = document.getElementsByClassName('html5-video-container')[0];
  video = document.getElementsByTagName('video')[0];
  buttonContainer = document.getElementsByClassName('html5-player-chrome')[0];
  videoWidth = videoContainer.parentNode.offsetWidth;
  videoHeight = videoContainer.parentNode.offsetHeight;
  videoTitle = title.textContent;
  console.log('videoTitle', videoTitle);

  getViewerInfo(videoTitle);
  getVRDevices();
  //if(!vrHMD)

  //disposePanoramaViewer();
  createOrResetPanoramaViewer();
  createOrResetPanoramaButton();
  createOrResetOculusButton();
  createOrResetPanoramaModeLabel();
  createOrResetPositionTrackingScaleLabel();

  viewerInfo.isPanorama = true;
  youtubeSwitchViewer();
}();

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

});

function youtubeSwitchViewer() {
  if (viewerInfo.isPanorama) {
    viewerInfo.isPanorama = false;
    btnPanoramaToolTipText.textContent = changeToPanoramaViewerText;
    btnPanoramaPath.setAttributeNS(null, 'd', changeToPanoramaViewerSVG);
    if (isEmbed) {
      document.getElementsByTagName('video')[0].style.display = '';
    } else {
      videoContainer.style.display = '';
    }
    renderer.domElement.style.display = 'none';
    btnOculus.style.display = 'none';
    lblPanoramaMode.style.display = 'none';

    //disposePanoramaViewer();
    stopRender();
  } else {
    viewerInfo.isPanorama = true;
    btnPanoramaToolTipText.textContent = returnToYoutubePlayerText;
    btnPanoramaPath.setAttributeNS(null, 'd', returnToYoutubePlayerSVG);
    btnOculus.style.display = vrHMD && vrHMD.deviceName !== 'Mockulus Rift' ? '' : 'none';
    lblPanoramaMode.style.display = '';
    videoContainer.parentNode.appendChild(renderer.domElement);
    videoContainer.style.display = 'none';
    renderer.domElement.style.display = '';
    //createPanoramaViewer('html5-main-video');
    startRender();
  }
}

function urlArgParse(url) {
  var res = null;
  url.substr(url.lastIndexOf('?') + 1).split('&').forEach(function (kvp) {
    if (!kvp) return;
    var arr = kvp.split('=');
    res = res || {};
    res[arr[0]] = arr[1];
  });
  return res;
}

chrome.runtime.sendMessage({ action: ACT_FRAME_LOADED });

chrome.runtime.onMessage.addListener(function (msg) {
  switch (msg.action) {
    case ACT
  }
});
  