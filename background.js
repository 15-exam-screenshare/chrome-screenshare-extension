// 설치 확인
chrome.runtime.onInstalled.addListener(() => {
  console.log('HB Exam Helper is Installed');
  // 서버 등록
});

// popup 연결
chrome.extension.onConnect.addListener((port) => {
  console.log('connected');
  port.onMessage.addListener((msg) => {
    console.log('message from popup:', msg);

    chrome.desktopCapture.chooseDesktopMedia(['screen'], onAccessApproved);
  });
});

// 캡쳐 승인됨
function onAccessApproved(id, options) {
  if (!id) {
    console.log('Access Denied');
    return;
  }

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
function gotStream(stream) {
  console.log('Received local stream', stream);
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
