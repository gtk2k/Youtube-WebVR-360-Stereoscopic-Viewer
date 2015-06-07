///<reference path="chromeStorage.js"/>

var player;
var buttonContainer;
var btnPanorama, btnPanoramaPath, btnPanoramaToolTip, btnPanoramaToolTipText, btnPanoramaToolTipArrow;
var btnOculus, btnOculusToolTip, btnOculusToolTipText, btnOculusToolTipArow;
var lblPanoramaMode, lblPositionTrackingScale;
var xmlns = "http://www.w3.org/2000/svg";
var returnToYoutubePlayerText = 'Youtubeプレイヤーに戻す';
var changeToPanoramaViewerText = '360ビューワーに切り替える';
var watchOnOculusText = 'Oculus Riftで見る';
var returnToYoutubePlayerSVG = 'M38 10h-28c-2.21 0-4 1.79-4 4v20c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4v-20c0-2.21-1.79-4-4-4zm0 24h-28v-20h28v20z';
var changeToPanoramaViewerSVG = 'M40 13.09v21.82c-5.19-1.54-10.56-2.32-16-2.32-5.44 0-10.8.78-16 2.32v-21.82c5.19 1.54 10.56 2.32 16 2.32 5.44 0 10.8-.78 16-2.32m2.86-5.09c-.19 0-.4.04-.62.12-5.88 2.19-12.06 3.29-18.24 3.29-6.18 0-12.36-1.1-18.24-3.29-.22-.08-.43-.12-.63-.12-.66 0-1.13.47-1.13 1.25v29.5c.01.78.47 1.25 1.13 1.25.19 0 .4-.04.62-.12 5.88-2.19 12.06-3.29 18.24-3.29 6.18 0 12.36 1.1 18.24 3.29.22.08.43.12.62.12.66 0 1.14-.47 1.13-1.25v-29.5c.02-.78-.46-1.25-1.12-1.25z';
var oculusSVG = 'M24 9C14 9 5.46 15.22 2 24c3.46 8.78 12 15 22 15 10.01 0 18.54-6.22 22-15-3.46-8.78-11.99-15-22-15zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z';

function createOrResetPanoramaButtonToolTip() {
  if (btnPanoramaToolTip) {
    btnPanoramaToolTipText.textContent = changeToPanoramaViewerText;
    return;
  }

  btnPanoramaToolTip = document.createElement('div');
  btnPanoramaToolTip.className = 'ytp-tooltip';
  btnPanoramaToolTip.style.display = 'block';
  var btnPanoramaToolTipBody = document.createElement('div');
  btnPanoramaToolTipBody.className = 'ytp-tooltip-body';
  btnPanoramaToolTipText = document.createElement('span');
  btnPanoramaToolTipText.id = 'btnWdoPanoramaToolTipText';
  btnPanoramaToolTipText.className = 'ytp-text-tooltip';
  btnPanoramaToolTipText.textContent = viewerInfo.isPanorama ? returnToYoutubePlayerText : changeToPanoramaViewerText;
  btnPanoramaToolTipArrow = document.createElement('div');
  btnPanoramaToolTipArrow.id = 'btnWdoPanoramaToolTipArrow';
  btnPanoramaToolTipArrow.className = 'ytp-tooltip-arrow';
  btnPanoramaToolTipBody.appendChild(btnPanoramaToolTipText);
  btnPanoramaToolTip.appendChild(btnPanoramaToolTipBody);
  btnPanoramaToolTip.appendChild(btnPanoramaToolTipArrow);
  btnPanoramaToolTip.id = 'btnWdoPanoramaToolTip';
  var playerOffset = getOffset(player);
  var btnPanoramaOffset = getOffset(btnPanorama);
  player.appendChild(btnPanoramaToolTip);
  btnPanoramaToolTip.style.left = (btnPanoramaOffset.left - playerOffset.left - ((btnPanoramaToolTipText.offsetWidth - 20) / 2)) + 'px';
  btnPanoramaToolTipArrow.style.left = (((btnPanoramaToolTipText.offsetWidth) - btnPanoramaToolTipArrow.offsetWidth) / 2) + 'px';
  btnPanoramaToolTip.style.top = (btnPanoramaOffset.top - playerOffset.top) + 'px';
  btnPanoramaToolTip.style.display = 'none';
}

function createOrResetPanoramaButton() {
  if (btnPanorama) {
    btnPanoramaPath.setAttributeNS(null, 'd', changeToPanoramaViewerSVG);
    return;
  }

  btnPanorama = document.createElement('div');
  btnPanorama.classList.add('ytp-button');
  btnPanorama.style.cssFloat = 'right';
  btnPanorama.style.width = '30px';
  btnPanorama.style.height = '27px';
  btnPanorama.id = 'btnWdoPanorama';
  var svg = document.createElementNS(xmlns, 'svg');
  svg.style.marginTop = '4px';
  svg.setAttributeNS(null, 'width', '20');
  svg.setAttributeNS(null, 'height', '20');
  svg.setAttributeNS(null, 'viewBox', '0 0 48 48');
  btnPanorama.onmouseover = function () {
    btnPanoramaPath.style.fill = 'rgb(164, 164, 164)';
    btnPanoramaToolTip = document.getElementById('btnWdoPanoramaToolTip');
    btnPanoramaToolTipText = document.getElementById('btnWdoPanoramaToolTipText');
    btnPanoramaToolTipArrow = document.getElementById('btnWdoPanoramaToolTipArrow');
    btnPanoramaToolTip.style.display = 'block';
    var playerOffset = getOffset(player);
    var btnPanoramaOffset = getOffset(btnPanorama);
    btnPanoramaToolTip.style.left = (btnPanoramaOffset.left - playerOffset.left - ((btnPanoramaToolTipText.offsetWidth - 20) / 2)) + 'px';
    btnPanoramaToolTipArrow.style.left = (((btnPanoramaToolTipText.offsetWidth) - btnPanoramaToolTipArrow.offsetWidth) / 2) + 'px';
    btnPanoramaToolTip.style.top = (btnPanoramaOffset.top - playerOffset.top) + 'px';
  }
  btnPanorama.onmouseleave = function () {
    btnPanoramaPath.style.fill = 'rgb(142, 142, 142)';
    btnPanoramaToolTip.style.display = 'none';
  }
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
  btnPanoramaPath.style.fill = 'rgb(142, 142, 142)';
  btnPanoramaPath.style.fillOpacity = '1';
  btnPanoramaPath.style.stroke = 'none';
  btnPanoramaPath.style.fillRule = 'evenodd';
  btnPanoramaPath.setAttributeNS(null, 'd', viewerInfo.isPanorama ? returnToYoutubePlayerSVG : changeToPanoramaViewerSVG);
  g.appendChild(btnPanoramaPath);
  svg.appendChild(g);
  btnPanorama.appendChild(svg);
  buttonContainer.appendChild(btnPanorama);

  createOrResetPanoramaButtonToolTip();
}

function createOrResetOculusButtonToolTip() {
  if (btnOculusToolTip) {
    btnPanoramaToolTip.style.display = 'none';
    return;
  }

  btnOculusToolTip = document.createElement('div');
  btnOculusToolTip.id = 'btnOculusToolTip';
  btnOculusToolTip.className = 'ytp-tooltip';
  btnOculusToolTip.style.display = 'block';
  var btnOculusToolTipBody = document.createElement('div');
  btnOculusToolTipBody.id = 'btnOculusToolTipBody';
  btnOculusToolTipBody.className = 'ytp-tooltip-body';
  btnOculusToolTipText = document.createElement('span');
  btnOculusToolTipText.id = 'btnOculusToolTipText';
  btnOculusToolTipText.className = 'ytp-text-tooltip';
  btnOculusToolTipText.textContent = watchOnOculusText;
  btnOculusToolTipArow = document.createElement('div');
  btnOculusToolTipArow.id = 'btnOculusToolTipArow';
  btnOculusToolTipArow.className = 'ytp-tooltip-arrow';
  btnOculusToolTipBody.appendChild(btnOculusToolTipText);
  btnOculusToolTip.appendChild(btnOculusToolTipBody);
  btnOculusToolTip.appendChild(btnOculusToolTipArow);
  player.appendChild(btnOculusToolTip);
  var playerOffset = getOffset(player);
  var btnOculusOffset = getOffset(btnOculus);
  btnOculusToolTip.style.left = (btnOculusOffset.left - playerOffset.left - ((btnOculusToolTipText.offsetWidth - 20) / 2)) + 'px';
  btnOculusToolTipArow.style.left = (((btnOculusToolTipText.offsetWidth) - btnOculusToolTipArow.offsetWidth) / 2) + 'px';
  btnOculusToolTip.style.top = (btnOculusOffset.top - playerOffset.top) + 'px';
  btnOculusToolTip.style.display = 'none';
}

function createOrResetOculusButton() {
  if (btnOculus) {
    btnOculus.style.display = 'none';
    return;
  }

  btnOculus = document.createElement('div');
  btnOculus.classList.add('ytp-button');
  btnOculus.style.cssFloat = 'right';
  btnOculus.style.width = '30px';
  btnOculus.style.height = '30px'; // 27px
  btnOculus.style.bottom = 0;
  btnOculus.style.display = 'none';
  btnOculus.setAttribute('aria-label', watchOnOculusText);
  btnOculus.id = 'btnWdoOculus';
  var svg = document.createElementNS(xmlns, 'svg');
  svg.style.marginTop = '4px';
  svg.setAttributeNS(null, 'width', '20');
  svg.setAttributeNS(null, 'height', '20');
  svg.setAttributeNS(null, 'viewBox', '0, 0, 48, 48');
  btnOculus.onmouseover = function () {
    btnOculusPath.style.fill = 'rgb(164, 164, 164)';
    btnOculusToolTip.style.display = 'block';
    var playerOffset = getOffset(player);
    var btnOculusOffset = getOffset(btnOculus);
    btnOculusToolTip.style.left = (btnOculusOffset.left - playerOffset.left - ((btnOculusToolTipText.offsetWidth - 20) / 2)) + 'px';
    btnOculusToolTipArow.style.left = (((btnOculusToolTipText.offsetWidth) - btnOculusToolTipArow.offsetWidth) / 2) + 'px';
    btnOculusToolTip.style.top = (btnOculusOffset.top - playerOffset.top) + 'px';
  };
  btnOculus.onmouseleave = function () {
    btnOculusPath.style.fill = 'rgb(142, 142, 142)';
    if (btnOculusToolTip) {
      btnOculusToolTip.style.display = 'none';
    }
  };
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
  btnOculusPath.style.fill = 'rgb(142,142,142)';
  btnOculusPath.style.fillOpacity = '1';
  btnOculusPath.style.stroke = 'none';
  btnOculusPath.style.fillRule = 'evenodd';
  btnOculusPath.setAttributeNS(null, 'd', oculusSVG);
  g.appendChild(btnOculusPath);
  svg.appendChild(g);
  btnOculus.appendChild(svg);
  buttonContainer.appendChild(btnOculus);

  createOrResetOculusButtonToolTip();
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
  lblPanoramaMode.style.lineHeight = '30px'; // 27px
  lblPanoramaMode.style.color = 'rgb(164, 164, 164)';
  lblPanoramaMode.style.bottom = 0;
  lblPanoramaMode.style.display = 'none';
  lblPanoramaMode.style.marginRight = '20px';
  lblPanoramaMode.setAttribute('aria-label', 'Panorama Mode');
  lblPanoramaMode.id = 'lblPanoramaMode';
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
    lblPanoramaMode.textContent = '360° TAB';
  } else if (viewerInfo.mode === MODE_RAW_THETA) {
    lblPanoramaMode.textContent = 'THETA';
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
