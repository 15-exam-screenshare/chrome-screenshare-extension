const { stringLiteral } = require("@babel/types");

var isRecording = false;
var currentStream = null;

// 설치 확인
chrome.runtime.onInstalled.addListener(() => {
  console.log('HB Exam Helper is Installed');
  // 서버 등록
});

// popup 연결
chrome.extension.onConnect.addListener((port) => {  
  // 현재 상태를 팝업에 반영
  console.log('current state', isRecording);
  if (isRecording){
    port.postMessage({'state':'isRecordingTrue'});
    showStream(currentStream);
  }

  /* popup에서 startRecord를 누르면 메시지 패싱을 받아 이 함수가 수행됨 */
  port.onMessage.addListener((msg) => {
    /* msg의 값은 ['action': 'startRecord'] 
      이후, ['action': 'stopRecord']도 보낼 것임 */
    console.log('message from popup:', msg);
    
    if (msg['action'] === 'startRecord'){
      chrome.desktopCapture.chooseDesktopMedia(['screen'], onAccessApproved);
    }
    
  });
});

// 캡쳐 승인됨
function onAccessApproved(id, options) {
  if (!id) {
    console.log('Access Denied');
    return;
  }
  isRecording = true;

  var audioConstraint = {
    mandatory: {
      chromeMediaSource: 'desktop',
      chromeMediaSourceId: id,
    },
  };
  console.log(options.canRequestAudioTrack);
  if (!options.canRequestAudioTrack) audioConstraint = false;

  navigator.webkitGetUserMedia(
    {
      audio: audioConstraint,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: id,
          maxWidth: screen.width,
          maxHeight: screen.height,
        },
      },
    },
    gotStream,
    getUserMediaError
  );
}

function getUserMediaError(error) {
  console.log('navigator.webkitGetUserMedia() errot: ', error);
}

function gotStream(stream){
  // 스트림 중지 동작 등록
  stream.onended = () => {
    isRecording = false;
    currentStream = null;
  }
  showStream(stream);
}

function showStream(stream) {
  console.log('Received local stream', stream);
  currentStream = stream;

  var views = chrome.extension.getViews({type:'popup'});
  for (var i=0; i<views.length; i++){
      var video = views[i].document.getElementById('screenCapture');
      console.log('video');
      try {
        video.srcObject = stream;
      } catch (error) {
        console.log(error);
        video.src = URL.createObjectURL(stream);
      }
      stream.onended = function () {
        console.log('Ended');
      };
  }
}
