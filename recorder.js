window.onload = init;

function init() {
  var videoScreen = document.querySelector("#video_screen_record");
  document.querySelector("#start_record_screen").addEventListener(
    "click",
    async (event) => {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
          audio: true,
        })
        .then((mediaStream) => {
          videoScreen.srcObject = mediaStream;
        })
        .catch((error) => {
          console.error("Error: " + error);
        });
    },
    false
  );
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  var videoCam = document.querySelector("#video_cam_record");
  document.querySelector("#start_record_cam").addEventListener(
    "click",
    async (event) => {
      console.log("cam record granted");
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          console.log(stream);
          videoCam.srcObject = stream;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    false
  );
}
