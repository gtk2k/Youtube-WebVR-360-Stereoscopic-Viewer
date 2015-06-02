///<reference path="three.js"/>
///<reference path="UI.js"/>
///<reference path="PanoramaViewer.js"/>
///<reference path="MouseKeyboard.js"/>
///<reference path="YoutubePageContextScript.js"/>

var daRafId;
var videoInfo = {
  flip: FLIP_NONE,
  rotate: new THREE.Quaternion(0, 0, 0, 0),
  mode: MODE_NORMAL,
  swapEye: SWAP_NONE,
  type: TYPE_NORMAL,
  clear: function(){
    this.flip = FLIP_NONE;
    this.rotate = new THREE.Quaternion(0, 0, 0, 0),
    this.mode = MODE_NORMAL,
    this.swapEye = SWAP_NONE,
    this.type = TYPE_NORMAL
  }
};

var youtubePlayerState = 1;
var viewerType = TYPE_NORMAL;
var videoContainer, video, videoWidth, videoHeight, videoTitle = '';


var vrHMD, vrPositionSensor;
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
  if (viewerType === TYPE_PANORAMA) {
    if (btnOculus) {
      btnOculus.style.display = vrHMD && vrHMD.deviceName !== 'Mockulus Rift' ? '' : 'none';
    }
  }
});

window.addEventListener('wdoYoutubePlayerReady', function (event) {
  console.log('Youtube Player Ready');
}, false);

window.addEventListener('wdoChangeStateYoutubePlayer', function (event) {
  console.log('state', event.detail);
  youtubePlayerState = event.detail;
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

function detectAnything() {
  daRafId = requestAnimationFrame(detectAnything);
  var title = document.getElementById('eow-title') || document.getElementsByClassName('html5-title-text')[0];
  if (title && title.textContent !== videoTitle) {
    videoTitle = title.textContent;
    console.log('videoTitle', videoTitle);
    getVideoType(videoTitle);
    video = document.getElementsByTagName('video')[0];
    disposePanoramaViewer();
    if (btnOculus) {
      btnOculus.style.display = 'none';
    }
    if (lblPanoramaMode) {
      lblPanoramaMode.style.display = 'none';
    }
    if (video) {
      if (btnPanoramaPath) {
        btnPanoramaPath.setAttributeNS(null, 'd', changeToPanoramaViewerSVG);
        btnPanoramaToolTipText.textContent = '360ビューワーに切り替える';
        viewerType = TYPE_NORMAL;
      } else {
        buttonContainer = document.getElementsByClassName('html5-player-chrome')[0];
        createPanoramaButton();
      }
      if (!btnOculus) {
        createOculusButton();
      }
      if (lblPanoramaMode) {
        if (videoInfo.mode === MODE_NORMAL) {
          lblPanoramaMode.textContent = '360°';
        } else if (videoInfo.mode === MODE_SIDE_BY_SIDE) {
          lblPanoramaMode.textContent = '360° SBS';
        } else if (videoInfo.mode === MODE_TOP_AND_BOTTOM) {
          lblPanoramaMode.textContent = '360° TAB';
        } else if (videoInfo.mode === MODE_RAW_THETA) {
          lblPanoramaMode.textContent = 'THETA';
        }
      } else {
        createPanoramaModeLabel();
      }
      videoContainer = document.getElementsByClassName('html5-video-container')[0];
      if (videoContainer) {
        var w = videoContainer.parentNode.offsetWidth;
        var h = videoContainer.parentNode.offsetHeight;
        if (videoWidth !== w || videoHeight !== h) {
          videoWidth = w;
          videoHeight = h;
        }
      }
    }
  }
}

if (!daRafId) {
  detectAnything();
}

function getVideoType(title) {
  videoInfo.clear();

  var ms = title.match(/【(.*?)】/g);
  if (ms) {
    for (var i = ms.length; i--;) {
      var m = ms[i].toLowerCase();
      if (m.indexOf('fh') !== -1) {
        videoInfo.flip = FLIP_HORIZONTAL;
      } else if (m.indexOf('fv') !== -1) {
        videoInfo.flip = FLIP_VERTICAL;
      } else if (m.indexOf('fb') !== -1) {
        videoInfo.flip = FLIP_BOTH;
      }

      if (m.indexOf('360') !== -1) {
        if (m.indexOf('nml') !== -1) {
          videoInfo.type = TYPE_PANORAMA;
          videoInfo.mode = MODE_NORMAL;
        } else if (m.indexOf('sbs') !== -1) {
          videoInfo.type = TYPE_PANORAMA;
          videoInfo.mode = MODE_SIDE_BY_SIDE;
        } else if (m.indexOf('tab') !== -1) {
          videoInfo.type = TYPE_PANORAMA;
          videoInfo.mode = MODE_TOP_AND_BOTTOM;
        }
      } else if (m.indexOf('rawtheta') !== -1 || m.indexOf('rawθ') !== -1) {
        videoInfo.type = TYPE_RAW_THETA;
      }

      if (m.indexOf('se') !== -1) {
        videoInfo.swap = SWAP_EYE;
      }

    }
  }
}

function youtubeSwitchViewer() {
  var btnPanoramaToolTipText = document.getElementById('btnWdoPanoramaToolTipText');
  var btnPanoramaPath = document.getElementById('btnWdoPanoramaPath');
  if (viewerType === TYPE_NORMAL) {
    videoInfo.type = viewerType = TYPE_PANORAMA;
    if (btnPanoramaToolTipText) {
      btnPanoramaToolTipText.textContent = 'Youtubeプレイヤーに戻す';
    }
    btnPanoramaPath.setAttributeNS(null, 'd', returnToYoutubePlayerSVG);
    createPanoramaViewer('html5-main-video');
    btnOculus.style.display = vrHMD && vrHMD.deviceName !== 'Mockulus Rift' ? '' : 'none';
    lblPanoramaMode.style.display = '';
    if (renderer && videoContainer) {
      videoContainer.parentNode.appendChild(renderer.domElement);
      videoContainer.style.display = 'none';
      render();
    }
  } else {
    videoInfo.type = viewerType = TYPE_NORMAL;
    if (btnPanoramaToolTipText) {
      btnPanoramaToolTipText.textContent = '360ビューワーに切り替える';
    }
    btnPanoramaPath.setAttributeNS(null, 'd', changeToPanoramaViewerSVG);
    if (isEmbed) {
      document.getElementsByTagName('video')[0].style.display = '';
    } else {
      document.getElementsByClassName('html5-video-container')[0].style.display = '';
    }
    disposePanoramaViewer();
    btnOculus.style.display = 'none';
    lblPanoramaMode.style.display = 'none';
  }
}

