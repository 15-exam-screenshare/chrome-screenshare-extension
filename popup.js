var isScreenShareing = false;
var isCamShareing = false;

// connect message pass
var port = chrome.extension.connect({
  name: "Connection with Popup",
});

chrome.runtime.onMessage.addListener((msg) => {
  console.log("runtime", msg);
  // background.js에 저장된 상태 반영
  if (msg["type"] === "screenShare") {
    isScreenShareing = msg["isActive"];
    if (btnScreenShare != null){
      console.log("btnScreenShare is not null");
      btnScreenShare.innerHTML = btnScreenShareText[!isScreenShareing];
    }
  }

  if (msg["type"] === "camShare") {
    isCamShareing = msg["isActive"];
    if (btnCamShare != null)
      btnCamShare.innerHTML = btnCamShareText[!isCamShareing];
  }
});
/// init
/* html이 모두 로드되고 실행되는 부분 */
window.onload = init;
var btnScreenShare = null;
var btnCamShare = null;
var btnScreenShareText = {
  true: "Start Sharing Screen",
  false: "Stop Sharing Screen",
};
var btnCamShareText = {
  true: "Start Sharing Cam",
  false: "Stop Sharing Cam",
};

function init() {
  btnScreenShare = document.querySelector("#btn_screen_share");
  btnCamShare = document.querySelector("#btn_cam_share");

  btnCamShare.addEventListener("click", onBtnCamShare);
  btnScreenShare.addEventListener("click", onBtnScreenShare);

  btnScreenShare.innerHTML = btnCamShareText[!isScreenShareing];
  btnCamShare.innerHTML = btnCamShareText[!isScreenShareing];
}

function onBtnScreenShare(event) {
  console.log("onBtnScreenShare, currentShare:", isScreenShareing);
  if (isScreenShareing)
    port.postMessage({ type: "screenShare", action: "stop" });
  else port.postMessage({ type: "screenShare", action: "start" });
}

function onBtnCamShare(event) {
  console.log("onBtnCamShare, currentShare:", isCamShareing);
  if (isCamShareing) port.postMessage({ type: "camShare", action: "stop" });
  else port.postMessage({ type: "camShare", action: "start" });
}
