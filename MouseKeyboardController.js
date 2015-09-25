///<reference path="YoutubePageContextScript.js"/>
///<reference path="PanoramaViewer.js"/>
///<reference path="youtubewebvr.js"/>

var xVector = new THREE.Vector3(1, 0, 0);
var yVector = new THREE.Vector3(0, 1, 0);
var mouseXOnMouseDown = 0, mouseYOnMouseDown = 0;
var mouseX = 0, mouseY = 0;
var targetRotationX = 0, targetRotationY = 0;
var targetRotationOnMouseDownX = 0, targetRotationOnMouseDownY = 0;
var KEY_UP = 87;
var KEY_DOWN = 83;
var KEY_LEFT = 65;
var KEY_RIGHT = 68;
var KEY_W = 'W'.charCodeAt(0);
var KEY_A = 'A'.charCodeAt(0);
var KEY_S = 'S'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);
var KEY_P = 'P'.charCodeAt(0);
var KEY_G = 'G'.charCodeAt(0);
var KEY_X = 'X'.charCodeAt(0);
var KEY_T = 'T'.charCodeAt(0);
var KEY_Z = 'Z'.charCodeAt(0);
var KEY_I = 'I'.charCodeAt(0);

function viewerMouseDown(event) {
  event.preventDefault();
  event.stopPropagation();

  window.addEventListener('mousemove', windowMouseMove, false);
  window.addEventListener('mouseup', windowMouseUp, false);

  mouseXOnMouseDown = event.clientX;// - (window.innerWidth / 2);
  targetRotationOnMouseDownX = targetRotationX;

  mouseYOnMouseDown = event.clientY;// - (window.innerHeight / 2);
  targetRotationOnMouseDownY = targetRotationY;
}

function windowMouseMove(event) {
  mouseX = event.clientX;// - (window.innerWidth / 2);
  mouseY = event.clientY;// - (window.innerHeight / 2);

  targetRotationY = targetRotationOnMouseDownY - (mouseY - mouseYOnMouseDown) * 0.004;
  targetRotationX = targetRotationOnMouseDownX - (mouseX - mouseXOnMouseDown) * 0.004;
  if (targetRotationY > 1) targetRotationY = 1;
  if (targetRotationY < -1) targetRotationY = -1;
}

function windowMouseUp() {
  window.removeEventListener('mousemove', windowMouseMove, false);
  window.removeEventListener('mouseup', windowMouseUp, false);
}

window.addEventListener('keydown', windowKeyDown, false);
function windowKeyDown(event) {
  // Track WASD and arrow keys.
  switch (event.keyCode) {
    case KEY_W: //case KEY_UP:
      //this.animatePhi_(this.phi + KEY_SPEED);
      break;
    case KEY_S: //case KEY_DOWN:
      //this.animatePhi_(this.phi - KEY_SPEED);
      break;
    case KEY_A: //case KEY_LEFT:
      //this.animateTheta_(this.theta + KEY_SPEED);
      break;
    case KEY_D: //case KEY_RIGHT:
      //this.animateTheta_(this.theta - KEY_SPEED);
      break;
    case KEY_P:
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
        changeTHETAUniforms(0.821, 0.2913, 0.62, 0.7536, 0.62);
      } else if (viewerInfo.mode === MODE_RAW_THETA_S) {
        viewerInfo.mode = MODE_NORMAL;
      }
      setPanoramaModeText();
      break;
    case KEY_T:
      positionTrackingScale++;
      if (positionTrackingScale === 11) {
        positionTrackingScale = 0;
      }
      break;
    case KEY_G:
      positionTrackingScale = 0;
      break;
    case KEY_X:
      // TODO 現在はRED_CYANのみ
      viewerInfo.anaglyphMode = viewerInfo.anaglyphMode === ANAGLYPH_MODE_RED_CYAN ? ANAGLYPH_MODE_NONE : ANAGLYPH_MODE_RED_CYAN;
      break;
    case KEY_Z:
      if (vrPositionSensor) {
        vrPositionSensor.resetSensor();
      }
      break;
    case KEY_I:
      viewerInfo.isSwapEye = !viewerInfo.isSwapEye;
      break;
  }
}
