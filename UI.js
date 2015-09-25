///<reference path="chromeStorage.js"/>

var player;
var buttonContainer;
var btnPanorama, btnPanoramaPath, btnPanoramaToolTip, btnPanoramaToolTipText, btnPanoramaToolTipArrow;
var btnOculus, btnOculusToolTip, btnOculusToolTipText, btnOculusToolTipArow;
var lblPanoramaMode, lblPositionTrackingScale;
var xmlns = "http://www.w3.org/2000/svg";
var returnToYoutubePlayerText = 'Return to Youtube player';
var changeToPanoramaViewerText = 'Change to 360 viewer';
var viewOnOculusText = 'View on Oculus Rift';
var returnToYoutubePlayerSVG = 'M38 10h-28c-2.21 0-4 1.79-4 4v20c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4v-20c0-2.21-1.79-4-4-4zm0 24h-28v-20h28v20z';
//var changeToPanoramaViewerSVG = 'M40 13.09v21.82c-5.19-1.54-10.56-2.32-16-2.32-5.44 0-10.8.78-16 2.32v-21.82c5.19 1.54 10.56 2.32 16 2.32 5.44 0 10.8-.78 16-2.32m2.86-5.09c-.19 0-.4.04-.62.12-5.88 2.19-12.06 3.29-18.24 3.29-6.18 0-12.36-1.1-18.24-3.29-.22-.08-.43-.12-.63-.12-.66 0-1.13.47-1.13 1.25v29.5c.01.78.47 1.25 1.13 1.25.19 0 .4-.04.62-.12 5.88-2.19 12.06-3.29 18.24-3.29 6.18 0 12.36 1.1 18.24 3.29.22.08.43.12.62.12.66 0 1.14-.47 1.13-1.25v-29.5c.02-.78-.46-1.25-1.12-1.25z';
var changeToPanoramaViewerSVG = 'M 38,10 C 28,13 19.894036,13.126269 10,10 7.8926947,9.334144 6,11.79 6,14 l 0,20 c 0,2.21 1.8736894,4.602415 4,4 9.353968,-2.650116 18.64599,-3.070031 28,0 2.099798,0.689164 4,-1.79 4,-4 l 0,-20 c 0,-2.21 -1.854419,-4.5297012 -4,-4 z m 0,24 C 28.987074,30.914009 19.68575,31.02264 10,34 l 0,-20 c 10,3 18,3 28,0 z';
var oculusSVG = 'M24 9C14 9 5.46 15.22 2 24c3.46 8.78 12 15 22 15 10.01 0 18.54-6.22 22-15-3.46-8.78-11.99-15-22-15zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z';
var toolTip;
var toolTipText;

function createOrResetPanoramaButton() {
  if (btnPanorama) {
    btnPanoramaPath.setAttributeNS(null, 'd', changeToPanoramaViewerSVG);
    return;
  }

  btnPanorama = document.createElement('button');
  btnPanorama.classList.add('ytp-button');
  btnPanorama.classList.add('ytp-setting-buttn');
  btnPanorama.style.cssFloat = 'right';
  btnPanorama.id = 'btnWdoPanorama';
  var svg = document.createElementNS(xmlns, 'svg');
  svg.style.marginTop = '4px';
  svg.setAttributeNS(null, 'width', '100%');
  svg.setAttributeNS(null, 'height', '100%');
  svg.setAttributeNS(null, 'viewBox', '0 0 64 64');
  btnPanorama.addEventListener('mouseover', function () {
    btnPanorama.style.fill = 'rgb(255, 255, 255)';
    setTimeout(function () {
      //toolTip.style.display = '';
      toolTipText.textContent = viewerInfo.isPanorama ? changeToPanoramaViewerText : returnToYoutubePlayerText;
      var playerOffset = getOffset(player);
      var btnPanoramaOffset = getOffset(btnPanorama);
      toolTip.style.left = (btnPanoramaOffset.left - playerOffset.left - ((toolTip.offsetWidth - 20) / 2)) + 'px';
    }, 600);
  });
  btnPanorama.addEventListener('mouseleave', function () {
    btnPanoramaPath.style.fill = 'rgb(255, 255, 255)';//'rgb(142, 142, 142)';
  });
  btnPanorama.onclick = function () {
    if (!youtubePlayerState) return;
    videoWidth = videoContainer.parentNode.offsetWidth;
    videoHeight = videoContainer.parentNode.offsetHeight;
    renderer.setSize(videoWidth, videoWidth / 1.777);
    youtubeSwitchViewer();
  };
  var g = document.createElementNS(xmlns, 'g');
  btnPanoramaPath = document.createElementNS(xmlns, 'path');
  btnPanoramaPath.id = 'btnWdoPanoramaPath';
  btnPanoramaPath.style.fill = 'rgb(235, 235, 236)'; //'rgb(142, 142, 142)';
  btnPanoramaPath.style.fillOpacity = '1';
  btnPanoramaPath.style.stroke = 'none';
  btnPanoramaPath.style.fillRule = 'evenodd';
  btnPanoramaPath.setAttributeNS(null, 'd', viewerInfo.isPanorama ? returnToYoutubePlayerSVG : changeToPanoramaViewerSVG);
  g.appendChild(btnPanoramaPath);
  svg.appendChild(g);
  btnPanorama.appendChild(svg);
  buttonContainer.appendChild(btnPanorama);
}

function createOrResetOculusButton() {
  if (btnOculus) {
    btnOculus.style.display = 'none';
    return;
  }

  btnOculus = document.createElement('button');
  btnOculus.classList.add('ytp-button');
  btnOculus.style.cssFloat = 'right';
  btnOculus.style.display = 'none';
  btnOculus.setAttribute('aria-label', viewOnOculusText);
  btnOculus.id = 'btnWdoOculus';
  var svg = document.createElementNS(xmlns, 'svg');
  svg.style.marginTop = '4px';
  svg.setAttributeNS(null, 'width', '100%');
  svg.setAttributeNS(null, 'height', '100%');
  svg.setAttributeNS(null, 'viewBox', '0, 0, 64, 64');
  btnOculus.addEventListener('mouseover', function () {
    toolTipText.textContent = viewOnOculusText;
    var playerOffset = getOffset(player);
    var btnOculusOffset = getOffset(btnOculus);
    btnOculusPath.style.fill = 'rgb(255, 255, 255)';
    //toolTip.style.display = '';
    toolTipText = 'View On Oculus Rift';
    toolTip.style.left = (btnOculusOffset.left - playerOffset.left - ((toolTipText.offsetWidth - 20) / 2)) + 'px';
  });
  btnOculus.addEventListener('mouseleave', function () {
    btnOculusPath.style.fill = 'rgb(235, 235, 236)';
    //toolTip.style.display = 'none';
  });
  btnOculus.onclick = function () {
    if (!youtubePlayerState) return;
    if (vrHMD && vrPositionSensor) {
      if (renderer.domElement.mozRequestFullScreen) {
        renderer.domElement.mozRequestFullScreen({ vrDisplay: vrHMD });
      } else if (renderer.domElement.webkitRequestFullscreen) {
        renderer.domElement.webkitRequestFullscreen({ vrDisplay: vrHMD });
      }
    }
  };
  var g = document.createElementNS(xmlns, 'g');
  var btnOculusPath = document.createElementNS(xmlns, 'path');
  btnOculusPath.id = 'btnOculusPath';
  btnOculusPath.style.fill = 'rgb(235, 235, 236)';//'rgb(142,142,142)';
  btnOculusPath.style.fillOpacity = '1';
  btnOculusPath.style.stroke = 'none';
  btnOculusPath.style.fillRule = 'evenodd';
  btnOculusPath.setAttributeNS(null, 'd', oculusSVG);
  g.appendChild(btnOculusPath);
  svg.appendChild(g);
  btnOculus.appendChild(svg);
  buttonContainer.appendChild(btnOculus);
}

function createOrResetPanoramaModeLabel() {
  if (lblPanoramaMode) {
    setPanoramaModeText();
    return;
  }

  lblPanoramaMode = document.createElement('div');
  lblPanoramaMode.classList.add('ytp-button');
  lblPanoramaMode.style.cssFloat = 'right';
  lblPanoramaMode.style.width = 'auto';
  lblPanoramaMode.style.height = '30px'; // 27px
  lblPanoramaMode.style.lineHeight = '36px'; // 27px
  lblPanoramaMode.style.color = 'rgb(235, 235, 236)';
  lblPanoramaMode.style.fontSize = '16px';
  lblPanoramaMode.style.bottom = 0;
  lblPanoramaMode.style.display = 'none';
  lblPanoramaMode.style.marginRight = '20px';
  lblPanoramaMode.setAttribute('aria-label', 'Panorama Mode');
  lblPanoramaMode.id = 'lblPanoramaMode';
  lblPanoramaMode.onclick = function () {
    if (!viewerInfo.isPanorama) return;
    if (viewerInfo.mode === MODE_NORMAL) {
      viewerInfo.mode = MODE_SIDE_BY_SIDE;
    } else if (viewerInfo.mode === MODE_SIDE_BY_SIDE) {
      viewerInfo.mode = MODE_TOP_AND_BOTTOM;
    } else if (viewerInfo.mode === MODE_TOP_AND_BOTTOM) {
      viewerInfo.mode = MODE_RAW_THETA;
      changeTHETAUniforms(0.905, 0.242, 0.625, 0.747, 0.625);
    } else if (viewerInfo.mode === MODE_RAW_THETA) {
      viewerInfo.mode = MODE_RAW_THETA_S;
      changeTHETAUniforms(0.821, 0.7536, 0.62, 0.2913, 0.62);
    } else if (viewerInfo.mode === MODE_RAW_THETA_S) {
      viewerInfo.mode = MODE_NORMAL;
    }
    setPanoramaModeText();
  }
  setPanoramaModeText();
  buttonContainer.appendChild(lblPanoramaMode);
}

function createOrResetPositionTrackingScaleLabel() {
  if (lblPositionTrackingScale){
    viewerInfo.positionTrackingScale.textContent = viewerInfo.positionTrackingScale ? 'P x' + viewerInfo.positionTrackingScale : '';
    return;
  }

  lblPositionTrackingScale = document.createElement('div');
  lblPositionTrackingScale.classList.add('ytp-button');
  lblPositionTrackingScale.style.cssFloat = 'right';
  lblPositionTrackingScale.style.width = 'auto';
  lblPositionTrackingScale.style.height = '30px'; // 27px
  lblPositionTrackingScale.style.lineHeight = '30px'; // 27px
  lblPositionTrackingScale.style.color = 'rgb(164, 164, 164)';
  lblPositionTrackingScale.style.bottom = 0;
  lblPositionTrackingScale.style.display = 'none';
  lblPositionTrackingScale.style.marginRight = '20px';
  lblPositionTrackingScale.setAttribute('aria-label', 'Panorama Mode');
  lblPositionTrackingScale.id = 'lblPositionTrackingScale';
  buttonContainer.appendChild(lblPositionTrackingScale);
}

function setPanoramaModeText() {
  if (viewerInfo.mode === MODE_NORMAL) {
    lblPanoramaMode.textContent = '360°';
  } else if (viewerInfo.mode === MODE_SIDE_BY_SIDE) {
    lblPanoramaMode.textContent = '360° SBS';
  } else if (viewerInfo.mode === MODE_TOP_AND_BOTTOM) {
    lblPanoramaMode.textContent = '360° TB';
  } else if (viewerInfo.mode === MODE_RAW_THETA) {
    lblPanoramaMode.textContent = 'THETA m15';
  } else if (viewerInfo.mode === MODE_RAW_THETA_S) {
    lblPanoramaMode.textContent = 'THETA S';
  }
}

function getOffset(el) {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}
