///<reference path="three.min.js"/>
///<reference path="youtubewebvr.js"/>
///<reference path="OrbitControls.js"/>

var MODE_NORMAL = 0;
var MODE_SIDE_BY_SIDE = 1;
var MODE_TOP_AND_BOTTOM = 2;
var MODE_RAW_THETA = 3;

var ANAGLYPH_MODE_NONE = 0;
var ANAGLYPH_MODE_RED_CYAN = 1;
var ANAGLYPH_MODE_RED_GREEN = 2;
var ANAGLYPH_MODE_RED_BLUE = 3;
var ANAGLYPH_MODE_BLUE_AMBER = 4;

var SIDE_NONE = 0
var SIDE_LEFT = 1;
var SIDE_RIGHT = 2;
var SIDE_TOP = 3;
var SIDE_BOTTOM = 4;
var SIDE_RAW_THETA = 5;

var scene, geometry;
var renderer;
var camera;
var controls;
var material;
var videoTexture;
var mesh;
var rotator;
var renderRafId = 0;
var size, isEmbed = false;
var eyeFOVL, eyeFOVR;
var projectionMatrixL, projectionMatrixR;
var defaultProjectionMatrix;
var positionTrackingScale = 6;

var isAutoChange = false;
var viewerInfo = {
  isPanorama: false,
  isFlipH: false,
  isFlipV: false,
  isSwapEye: false,
  mode: MODE_NORMAL,
  anaglyphMode: ANAGLYPH_MODE_NONE,
  positionTrackingScale: 6
}


var fullscreenchange = document.body.mozRequestFullScreen ? 'mozfullscreenchange' : 'webkitfullscreenchange';
var isFullScreen = false;
document.addEventListener(fullscreenchange, function () {
  var fullScreenElement = document.mozFullScreenElement || document.webkitFullscreenElement;
  isFullScreen = !!fullScreenElement;
  if (isFullScreen) {
    renderer.setSize(window.innerWidth, window.innerHeight);
  } else {
    renderer.setSize(videoWidth, videoWidth / 1.7777 | 0);
    renderer.enableScissorTest(false);
    camera.quaternion.set(0, 0, 0, 0);
    camera.position.set(0, 0, 0);
    camera.projectionMatrix = defaultProjectionMatrix;
  }
});

function createOrResetPanoramaViewer(panoramaViewerClassName) {
  if (renderer) {
    camera.rotation.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
    return;
  }

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(videoWidth, videoWidth / 1.777 | 0);
  renderer.domElement.id = 'panoramaViewer';
  renderer.domElement.style.position = 'absolute';
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1.777, 0.1, 10000);
  if (eyeFOVL) {
    projectionMatrixL = fovToProjection(eyeFOVL.recommendedFieldOfView, true, camera.near, camera.far);
    projectionMatrixR = fovToProjection(eyeFOVR.recommendedFieldOfView, true, camera.near, camera.far);
  } else {
    projectionMatrixL = new THREE.Matrix4();
    var mL = projectionMatrixL.elements;
    mL[0]= 0.9297889471054077;
    mL[1] = 0;
    mL[2] = 0;
    mL[3] = 0;
    mL[4] = 0;
    mL[5] = 0.7509744167327881;
    mL[6] = 0;
    mL[7] = 0;
    mL[8] = 0.015671806409955025;
    mL[9] = 0;
    mL[10] = -1.0000100135803223;
    mL[11] = -1;
    mL[12] = 0;
    mL[13] = 0;
    mL[14] = -0.10000099986791611;
    mL[15] = 0;
    projectionMatrixR = new THREE.Matrix4();
    var mR = projectionMatrixR.elements;
    mR[0] = 0.9297889471054077;
    mR[1] = 0;
    mR[2] = 0;
    mR[3] = 0;
    mR[4] = 0;
    mR[5] = 0.7509744167327881;
    mR[6] = 0;
    mR[7] = 0;
    mR[8] = -0.015671806409955025;
    mR[9] = 0;
    mR[10] = -1.0000100135803223;
    mR[11] = -1;
    mR[12] = 0;
    mR[13] = 0;
    mR[14] = -0.10000099986791611;
    mR[15] = 0;
  }
  defaultProjectionMatrix = new THREE.Matrix4();
  defaultProjectionMatrix.copy(camera.projectionMatrix);
  videoTexture = new THREE.Texture(video);
  videoTexture.magFilter = videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.generateMipmaps = false;
  geometry = new THREE.SphereGeometry(100, 128, 128);
  geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  material = new THREE.ShaderMaterial({
    uniforms: {
      texture: { type: 't', value: videoTexture },
      flipH: { type: 'i', value: +viewerInfo.isFlipH },
      flipV: { type: 'i', value: +viewerInfo.isFlipV },
      side: { type: 'i', value: SIDE_NONE },
      anaglyph: { type: 'i', value: +viewerInfo.anaglyphMode }
    },
    vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '    vUv = uv;',
        '    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );',
        '}'
    ].join('\n'),
    fragmentShader: [
        'precision highp float;',
        'varying vec2 vUv;',
        'uniform sampler2D texture;',
        'uniform int flipH;',
        'uniform int flipV;',
        'uniform int side;',
        'uniform int anaglyph;',
        'float k = 0.905;',
        'void main(void) {',
        '  vec2 texPos = vec2(vUv.x, vUv.y);',
        '  if(anaglyph == 0){',
        '    if(flipH == 1){',
        '      texPos = vec2(1.0 - vUv.x, vUv.y);',
        '    }',
        '    if(flipV == 1){',
        '      texPos = vec2(vUv.x, 1.0 - vUv.y);',
        '    }',
        '',
        '    if(side == ' + SIDE_NONE + '){                 // SIDE_NONE',
        '    } else if(side == ' + SIDE_LEFT + '){          // SIDE_LEFT',
        '      texPos = vec2(texPos.x * 0.5, texPos.y);',
        '    } else if(side == ' + SIDE_RIGHT + '){         // SIDE_RIGHT',
        '      texPos = vec2(texPos.x * 0.5 + 0.5, texPos.y);',
        '    } else if(side == ' + SIDE_TOP + '){           // SIDE_TOP',
        '      texPos = vec2(texPos.x, texPos.y * 0.5);',
        '    } else if(side == ' + SIDE_BOTTOM + '){        // SIDE_BOTTOM',
        '      texPos = vec2(texPos.x, texPos.y * 0.5 + 0.5);',
        '    } else if(side == ' + SIDE_RAW_THETA + '){     // SIDE_RAW_THETA',
        '      float PI = 3.14159265358979323846264;',
        '      float theta = 2.0 * PI * texPos.x;',
        '      float x = mod((texPos.y * 2.0), 1.0) * k * cos(theta);',
        '      float y = mod((texPos.y * 2.0), 1.0) * k * sin(theta);',
        '',
        '      float theta2 = 2.0 * PI * (1.0 - texPos.x);',
        '      float x2 = (1.0 - mod((texPos.y * 2.0), 1.0)) * k * cos(theta2);',
        '      float y2 = (1.0 - mod((texPos.y * 2.0), 1.0)) * k * sin(theta2);',
        '',
        '      if (texPos.y < 0.5)',
        '      {',
        '        texPos.x = x * 0.25 + 0.242;',
        '        texPos.y = y * 0.5 + 0.625;',
        '      }',
        '      else',
        '      {',
        '        texPos.x = x2 * 0.25 + 0.747;',
        '        texPos.y = y2 * 0.5 + 0.625;',
        '      }',
        '      texPos.y = texPos.y * 960.0 / 1080.0;',
        '    }',
        '    gl_FragColor = texture2D(texture, texPos);',
        '  } else {',
        '    vec4 colorL, colorR;',
        '    if(side == ' + SIDE_LEFT + '){          // SIDE_LEFT',
        '      colorL = texture2D(texture, vec2(texPos.x * 0.5, texPos.y));',
        '      colorR = texture2D(texture, vec2(texPos.x * 0.5 + 0.5, texPos.y));',
        '    } else if(side == ' + SIDE_RIGHT + '){  // SIDE_RIGHT',
        '      colorL = texture2D(texture, vec2(texPos.x * 0.5 + 0.5, texPos.y));',
        '      colorR = texture2D(texture, vec2(texPos.x * 0.5, texPos.y));',
        '    } else if(side == ' + SIDE_TOP + '){    // SIDE_TOP',
        '      colorL = texture2D(texture, vec2(texPos.x, texPos.y * 0.5));',
        '      colorR = texture2D(texture, vec2(texPos.x, texPos.y * 0.5 + 0.5));',
        '    } else if(side == ' + SIDE_BOTTOM + '){ // SIDE_BOTTOM',
        '      colorL = texture2D(texture, vec2(texPos.x, texPos.y * 0.5 + 0.5));',
        '      colorR = texture2D(texture, vec2(texPos.x, texPos.y * 0.5));',
        '    }',
        '    if(anaglyph == 1){  // RED_CYAN',
        '      gl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;',
        '    } else if(anaglyph == 2){  // RED_GREEN',
        '    } else if(anaglyph == 3){  // RED_BLUE',
        '    } else if(anaglyph == 4){  // BLUE_AMBER',
        '    }',
        '  }',
        '}'
    ].join('\n'),
    side: THREE.DoubleSide
  });
  mesh = new THREE.Mesh(geometry, material);
  rotator = new THREE.Object3D();
  rotator.add(mesh);
  scene.add(rotator);

  //window.addEventListener('resize', windowResize, false);

  renderer.domElement.addEventListener('mousedown', viewerMouseDown, false);
  window.addEventListener('keydown', windowKeyDown, false);
}

function disposePanoramaViewer() {
  if (renderer) {
    scene.remove(mesh);
    scene = null;
    geometry.dispose();
    geometry = null;
    material.dispose();
    material = null;
    videoTexture.dispose();
    videoTexture = null;
    renderer.domElement.parentNode.removeChild(renderer.domElement);
    renderer = null;
    if (renderRafId) {
      cancelAnimationFrame(renderRafId);
      renderRafId = null;
    }
    video.style.display = '';
    videoContainer.style.display = '';
    window.removeEventListener('resize', windowResize, false);
  }
}

var xVector = new THREE.Vector3(1, 0, 0);
var yVector = new THREE.Vector3(0, 1, 0);
var mouseQuat = {
  x: new THREE.Quaternion(),
  y: new THREE.Quaternion()
};
var camOrientation = {
  x: 0,
  y: 0
};

var euler = new THREE.Euler();
function render() {
  videoTexture.needsUpdate = true;
  renderer.clear();
  if (isFullScreen) {
    var size = { width: renderer.domElement.width, height: renderer.domElement.height };
    size.width /= 2;
    var state = vrPositionSensor.getState();
    camera.quaternion.copy(state.orientation);
    camera.position.copy(state.position).multiplyScalar(positionTrackingScale * 50);
    renderer.enableScissorTest(true);
    // render left eye
    camera.projectionMatrix = projectionMatrixL;
    mesh.material.uniforms.side.value = getSide(viewerInfo.isSwapEye ? SIDE_RIGHT : SIDE_LEFT);
    renderer.setViewport(0, 0, size.width, size.height);
    renderer.setScissor(0, 0, size.width, size.height);
    renderer.render(scene, camera);
    // render right eye
    camera.projectionMatrix = projectionMatrixR;
    mesh.material.uniforms.side.value = getSide(viewerInfo.isSwapEye ? SIDE_LEFT : SIDE_RIGHT);
    renderer.setViewport(size.width, 0, size.width, size.height);
    renderer.setScissor(size.width, 0, size.width, size.height);
    renderer.render(scene, camera);
  } else {
    mesh.material.uniforms.side.value = getSide(viewerInfo.isSwapEye ? SIDE_RIGHT : SIDE_LEFT);
    mesh.material.uniforms.anaglyph.value = getAnaglyph();
    euler.y += (targetRotationX - euler.y) * 0.1;
    var rx = (targetRotationY - euler.x);
    if (euler.x <= 1 && euler.x >= -1) {
      euler.x +=  rx * 0.1;
    }
    if (euler.x > 1) {
      euler.x = 1;
    }
    if (euler.x < -1) {
      euler.x = -1;
    }
    mesh.rotation.copy(euler);
    if (viewerInfo.mode === MODE_RAW_THETA) {
      mesh.rotation.z -= Math.PI / 2;
    } else {
      mesh.rotation.y -= Math.PI / 2;
    }
    renderer.render(scene, camera);
  }
  renderRafId = requestAnimationFrame(render);
}

function startRender() {
  if (!renderRafId) {
    renderRafId = requestAnimationFrame(render);
  }
}

function stopRender() {
  if (renderRafId) {
    cancelAnimationFrame(renderRafId);
    renderRafId = 0;
  }
}

function getSide(side) {
  if (viewerInfo.isPanorama) {
    if (viewerInfo.mode === MODE_SIDE_BY_SIDE) {
      return side;
    } else if (viewerInfo.mode === MODE_TOP_AND_BOTTOM) {
      return side === SIDE_LEFT ? SIDE_TOP : SIDE_BOTTOM;
    } else if (viewerInfo.mode === MODE_RAW_THETA) {
      return SIDE_RAW_THETA;
    } else {
      return SIDE_NONE;
    }
  }
}

function getAnaglyph() {
  if (viewerInfo.mode === MODE_SIDE_BY_SIDE || viewerInfo.mode === MODE_TOP_AND_BOTTOM) {
    return viewerInfo.anaglyphMode;
  } else {
    return 0;
  }
}

function fovToNDCScaleOffset(fov) {
  var pxscale = 2.0 / (fov.leftTan + fov.rightTan);
  var pxoffset = (fov.leftTan - fov.rightTan) * pxscale * 0.5;
  var pyscale = 2.0 / (fov.upTan + fov.downTan);
  var pyoffset = (fov.upTan - fov.downTan) * pyscale * 0.5;
  return { scale: [pxscale, pyscale], offset: [pxoffset, pyoffset] };
}

function fovPortToProjection(fov, rightHanded, zNear, zFar) {

  rightHanded = rightHanded === undefined ? true : rightHanded;
  zNear = zNear === undefined ? 0.01 : zNear;
  zFar = zFar === undefined ? 10000.0 : zFar;

  var handednessScale = rightHanded ? -1.0 : 1.0;

  // start with an identity matrix
  var mobj = new THREE.Matrix4();
  var m = mobj.elements;

  // and with scale/offset info for normalized device coords
  var scaleAndOffset = fovToNDCScaleOffset(fov);

  // X result, map clip edges to [-w,+w]
  m[0 * 4 + 0] = scaleAndOffset.scale[0];
  m[0 * 4 + 1] = 0.0;
  m[0 * 4 + 2] = scaleAndOffset.offset[0] * handednessScale;
  m[0 * 4 + 3] = 0.0;

  // Y result, map clip edges to [-w,+w]
  // Y offset is negated because this proj matrix transforms from world coords with Y=up,
  // but the NDC scaling has Y=down (thanks D3D?)
  m[1 * 4 + 0] = 0.0;
  m[1 * 4 + 1] = scaleAndOffset.scale[1];
  m[1 * 4 + 2] = -scaleAndOffset.offset[1] * handednessScale;
  m[1 * 4 + 3] = 0.0;

  // Z result (up to the app)
  m[2 * 4 + 0] = 0.0;
  m[2 * 4 + 1] = 0.0;
  m[2 * 4 + 2] = zFar / (zNear - zFar) * -handednessScale;
  m[2 * 4 + 3] = (zFar * zNear) / (zNear - zFar);

  // W result (= Z in)
  m[3 * 4 + 0] = 0.0;
  m[3 * 4 + 1] = 0.0;
  m[3 * 4 + 2] = handednessScale;
  m[3 * 4 + 3] = 0.0;

  mobj.transpose();

  return mobj;
}

function fovToProjection(fov, rightHanded, zNear, zFar) {
  var DEG2RAD = Math.PI / 180.0;

  var fovPort = {
    upTan: Math.tan(fov.upDegrees * DEG2RAD),
    downTan: Math.tan(fov.downDegrees * DEG2RAD),
    leftTan: Math.tan(fov.leftDegrees * DEG2RAD),
    rightTan: Math.tan(fov.rightDegrees * DEG2RAD)
  };

  return fovPortToProjection(fovPort, rightHanded, zNear, zFar);
}

// color code?
/*
void main()
{
  vec3 left = texture2D(tex_left, gl_TexCoord[0].st).rgb;
  vec3 right = texture2D(tex_right, gl_TexCoord[0].st).rgb;

  vec3 col, coeff = vec3(0.15, 0.15, 0.7);
  col.r = left.r;
  col.g = left.g;
  col.b = dot(right, coeff);

  gl_FragColor = vec4(col, 1.0);
}
*/