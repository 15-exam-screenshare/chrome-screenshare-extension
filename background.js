var isScreenShared = false;
var currentScreenStream = null;

// 설치 확인
chrome.runtime.onInstalled.addListener(() => {
  console.log("HB Exam Helper is Installed");
  // 서버 등록
});

// initialize popup
chrome.extension.onConnect.addListener((port) => {
  console.log('popup connected', port);

  // The current state is going to be reflected in the popup page
  console.log('isScreenShared', isScreenShared)
  if (isScreenShared && currentScreenStream.isActive) {
    
    port.postMessage({ type: "screenShare", isActive: true });
    showScreenStream(currentScreenStream);
  }

  /* invoke the required function according to the type of message */
  port.onMessage.addListener((msg) => {
    console.log("message from popup:", msg);

    if (msg["type"] === "screenShare") onScreenCaptureCommand(msg["action"]);
    else if (msg["type"] === "camShare") onCamCaptureCommand(msg["action"]);
  });
});
function onScreenCaptureCommand(action) {
  if (action === "start")
    chrome.desktopCapture.chooseDesktopMedia(["screen"], onAccessApproved);
  else {
    // TODO: show some notices.
    currentScreenStream.getTracks().forEach((track) => track.stop());
  }
}
// 캡쳐 승인됨
function onAccessApproved(id, options) {
  if (!id) {
    console.log("Access Denied");
    return;
  }
  isScreenShared = true;

  var audioConstraint = {
    mandatory: {
      chromeMediaSource: "desktop",
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
          chromeMediaSource: "desktop",
          chromeMediaSourceId: id,
          maxWidth: screen.width,
          maxHeight: screen.height,
        },
      },
    },
    gotScreenStream,
    getUserMediaError
  );
}

function getUserMediaError(error) {
  console.log("navigator.webkitGetUserMedia() errot: ", error);
}

function gotScreenStream(screenStream) {
  // 스트림 중지 동작 등록
  screenStream.onended = () => {
    isScreenShared = false;
    currentScreenStream = null;
  };
  showScreenStream(screenStream);
}

function showScreenStream(screenStream) {
  console.log("Received local ScreenStream", screenStream);
  currentScreenStream = screenStream;

  var views = chrome.extension.getViews({ type: "popup" });
  for (var i = 0; i < views.length; i++) {
    var video = views[i].document.getElementById("screenCapture");
    console.log("video");
    try {
      video.srcObject = screenStream;
      chrome.runtime.sendMessage({ type: "screenShare", isActive: true });
      //        extensionPort.postMessage({'type': 'screenShare', 'isActive': true});
      console.log("sent");
    } catch (error) {
      console.log(error);
      video.src = URL.createObjectURL(screenStream);
    }
    screenStream.onended = function () {
      console.log("Ended");
      isScreenShared = false;
      extensionPort.postMessage({ type: "screenShare", isActive: false });
    };
  }
}
