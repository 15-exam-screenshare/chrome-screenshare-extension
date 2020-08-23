var isRecording = false;

// message pass 준비
var port = chrome.extension.connect({
  name: "Sample Connection from popup",
});

// message pass 수신
port.onMessage.addListener((msg) => {
  console.log("message from backgroun:", msg);

  // background.js에 저장된 상태 반영
  if (msg['state'] === 'isRecordingTrue'){
    isRecording = true;
    }
});

/// init
/* html이 모두 로드되고 실행되는 부분 */
window.onload = init;
function init() {
  /* startRecord 버튼에 대해 리스너가 부여됨 */


  var recordBtn = document.querySelector("#startRecord");
  if (isRecording){
      recordBtn.innerHTML = 'stop';
  }
    recordBtn.addEventListener("click", onClickStartRecord);
}

/* start Record 버튼 누르면 실행됨*/
function onClickStartRecord(event) {
  /* 미리 지정한 포트(background.js)로 메시지를 보냄 */
  port.postMessage({ action: "startRecord" });
}
