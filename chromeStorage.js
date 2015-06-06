///<reference path="PanoramaViewer.js"/>

// chrome.storageの保存領域は拡張機能単位で別となる。(ドメイン単位ではない)
// 別々の拡張機能で同じキーで保存したとしても別々に保存される。

var saveData = {};

function loadFromSyncStorage(callback) {
  chrome.storage.sync.get(
    {
      isPanorama: false,
      isFlipH: false,
      isFlipV: false,
      isSwapEye: false,
      mode: MODE_NORMAL,
      anaglyphMode: ANAGLYPH_MODE_NONE,
      positionTrackingScale: 0
    }
    , function (saveData) {
    
  });
}

function saveToSycStorage() {
  chrome.storage.sync.set(saveData, function () {
    // Notify that we saved.
    message('Settings saved');
  });
}

function viewerInfoSerialize() {
  var buffer = new Uint8Array(ArrayBuffer(3));
  buffer[0] |= viewerInfo.isPanorama;
  buffer[0] |= viewerInfo.isFlipH << 1;
  buffer[0] |= viewerInfo.isFlipV << 2;
  buffer[0] |= viewerInfo.isSwapEye << 3;
  // bit4 reserved
  // bit5 reserved
  buffer[0] |= viewerInfo.mode << 6;

  buffer[1] |= viewerInfo.anaglyphMode;
  buffer[1] |= viewerInfo.positionTrackingScale << 4;
  return buffer;
}

function dataDeserialize(data) {
  viewerInfo.isPanorama = data[0] & 0x1;
  viewerInfo.isFlipH = (data[0] & 0x2) >> 1;
  viewerInfo.isFlipV = (data[0] & 0x4) >> 2;
  viewerInfo.isSwapEye = (data[0] & 0x8) >> 3;
  // bit4 reserved
  // bit5 reserved
  viewerInfo.mode = (data[0] & 0xc0) >> 6;

  viewerInfo.anaglyphMode = data[1] & 0xf;
  viewerInfo.positionTrackingScale = (data[1] & 0xf0) >> 4;
}