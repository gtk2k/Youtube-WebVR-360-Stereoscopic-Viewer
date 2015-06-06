var OcuBuliVRDevice = function () {
  this.recommendedFieldOfView = { // Default DK2
    left: {
      upDegrees: 64.93594360351562,
      downDegrees: 64.93594360351562,
      leftDegrees: 64.71646881103516,
      rightDegrees: 44.149356842041016
    },
    right: {
      upDegrees: 64.93594360351562,
      downDegrees: 64.93594360351562,
      leftDegrees: 44.149356842041016,
      rightDegrees: 64.71646881103516
    }
  };
  this.eyeTranslation = {
    left: { x: -0.03200000151991844, y: -0, z: -0, w: 0 },
    right: { x: 0.03200000151991844, y: -0, z: -0, w: 0 }
  };
  this.orientation = {
    left: new THREE.Quaternion(0, 0, 0, 0),
    right: new THREE.Quaternion(0, 0, 0, 0)
  };
  this.position = {
    left: new THREE.Vector3(0, 0, 0),
    right: new THREE.Vector3(0, 0, 0)
  };


  var that = this;
  return new Promise(function (resolve, reject) {
    that.ws = new WebSocket('ws://localhost:4649/oculus');
    that.ws.onopen = function () {
      resolve();
    }
    that.ws.onmessage = that.wsOnMessage()
    this.ws.onclose = function () {
      reject();
    }
  });
};

OcuBuliVRDevice.prototype.getEyeParameters = function (side) {
  return {
    recommendedFieldOfView: this.recommendedFieldOfView[side],
    eyeTranslation: this.eyeTranslation[side]
  };
};

OcuBuliVRDevice.prototype.getState = function () {
  return {
    orientation: this.orientation['left'],
    position: this.position['left']
  };
};

OcuBuliVRDevice.prototype.wsOnMessage = function () {
  var msg = new WebSocketMessageParser(e.data);
  if (msg.cmd) {
    switch (msg.cmd) {
      case 'p':
        that.profile = msg;
        switch (msg.hmdType) {
          case 'DK1':
            that.recommendedFieldOfView = {
              left: {
                upDegrees: 64.93594360351562,
                downDegrees: 64.93594360351562,
                leftDegrees: 64.71646881103516,
                rightDegrees: 44.149356842041016
              },
              right: {
                upDegrees: 64.93594360351562,
                downDegrees: 64.93594360351562,
                leftDegrees: 44.149356842041016,
                rightDegrees: 64.71646881103516
              }
            };
            break;
          default:
            // DK2の値を使用
            that.recommendedFieldOfView = {
              left: {
                upDegrees: 64.93594360351562,
                downDegrees: 64.93594360351562,
                leftDegrees: 64.71646881103516,
                rightDegrees: 44.149356842041016
              },
              right: {
                upDegrees: 64.93594360351562,
                downDegrees: 64.93594360351562,
                leftDegrees: 44.149356842041016,
                rightDegrees: 64.71646881103516
              }
            };
            break;
        }

        // DefaultEyeFovを使用する場合はコメントアウトを外す
        //this.recommendedFieldOfView = this.profile.fov;
        break;
      case 'o':
        alert('他のページで接続中のため接続できません。');
        break;
    }
  } else {
    that.orientation = {
      left: new THREE.Quaternion(msg[0], msg[1], msg[2], msg[3]),
      right: new THREE.Quaternion(msg[4], msg[5], msg[6], msg[7])
    };
    that.position = {
      left: new THREE.Vector3(msg[8], msg[9], msg[10]),
      right: new THREE.Vector3(msg[11], msg[12], msg[13])
    };
  }
}


