// message pass 준비
var port = chrome.extension.connect({
  name: "Sample Connection from popup",
});

// message pass 수신
port.onMessage.addListener((msg) => {
  console.log("message from backgroun:", msg);
});

/// init
/* html이 모두 로드되고 실행되는 부분 */
window.onload = init;
function init() {
  /* startRecord 버튼에 대해 리스너가 부여됨 */
  document.querySelector("#startRecord").addEventListener("click", onClickStartRecord);
}

function onClickStartRecord(event){
    port.postMessage({ action: "startRecord" });
  }
