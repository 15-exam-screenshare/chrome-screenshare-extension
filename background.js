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
