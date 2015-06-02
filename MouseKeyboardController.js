///<reference path="YoutubePageContextScript.js"/>
///<reference path="PanoramaViewer.js"/>
///<reference path="youtubewebvr.js"/>

var xVector = new THREE.Vector3(1, 0, 0);
var yVector = new THREE.Vector3(0, 1, 0);
var mouseXOnMouseDown = 0, mouseYOnMouseDown = 0;
var mouseX = 0, mouseY = 0;
var targetRotationX = 0, targetRotationY = 0;
var targetRotationOnMouseDownX = 0, targetRotationOnMouseDownY = 0;

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
}

function windowMouseUp() {
  window.removeEventListener('mousemove', windowMouseMove, false);
  window.removeEventListener('mouseup', windowMouseUp, false);
}

window.addEventListener('keydown', windowKeyDown, false);
function windowKeyDown(event) {
  // Track WASD and arrow keys.
  if (event.keyCode == 38 || event.keyCode == 87) { // W or Up key.
    this.animatePhi_(this.phi + KEY_SPEED);
  } else if (event.keyCode == 39 || event.keyCode == 68) { // D or Right key.
    this.animateTheta_(this.theta - KEY_SPEED);
  } else if (event.keyCode == 40 || event.keyCode == 83) { // S or Down key.
    this.animatePhi_(this.phi - KEY_SPEED);
  } else if (event.keyCode == 37 || event.keyCode == 65) { // A or Left key.
    this.animateTheta_(this.theta + KEY_SPEED);
  } else if (event.keyCode == 'P'.charCodeAt(0)) {
    if (viewerType !== TYPE_PANORAMA) return;
    mesh.rotation.set(0, 0, 0, 'XYZ');
    if (videoInfo.mode === MODE_NORMAL) {
      videoInfo.mode = MODE_SIDE_BY_SIDE;
      lblPanoramaMode.textContent = '360° SBS';
    } else if (videoInfo.mode === MODE_SIDE_BY_SIDE) {
      videoInfo.mode = MODE_TOP_AND_BOTTOM;
      lblPanoramaMode.textContent = '360° TAB';
    } else if (videoInfo.mode === MODE_TOP_AND_BOTTOM) {
      videoInfo.mode = MODE_RAW_THETA;
      mesh.rotateZ(-Math.PI / 2);
      lblPanoramaMode.textContent = 'THETA';
    } else if (videoInfo.mode === MODE_RAW_THETA) {
      videoInfo.mode = MODE_NORMAL;
      lblPanoramaMode.textContent = '360°';
    }
  } else if (event.keyCode == 'Z'.charCodeAt(0)) {
    if (vrPositionSensor) {
      vrPositionSensor.resetSensor();
    }
  }
}
