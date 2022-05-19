const constraints = {
  audio: false,
  video: true,
};
function handlesuccese(stream: MediaStream) {
  console.log(stream);

  const video = document.querySelector("video");
  const videoTracks = stream.getVideoTracks();
  console.log("Got stream with constraints:", constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  console.log("videoTracks", videoTracks);

  // make variable available to browser console
  video.srcObject = stream; //its like setiing a src of video to a file
}

async function getstreamwithconstarints(constraints: MediaStreamConstraints) {
  return navigator.mediaDevices.getUserMedia(constraints);
}

async function init(e: Event, constraint: MediaStreamConstraints) {
  try {
    const video = document.querySelector("video");
    if (video.srcObject !== null) {
      video.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const stream = await getstreamwithconstarints(constraint);
    stream.getTracks().forEach((track) => {
      console.log("setting",track.getConstraints());
    });
    handlesuccese(stream);
  } catch (e) {
    console.log(e);
  }
}

document
  .querySelector("#showVideo")
  .addEventListener("click", (e) => init(e, constraints));
document.getElementById("cheao cam").addEventListener("click", (e) =>
  init(e, {
    video: { width: { exact: 4 }, height: { exact: 3 } },
    audio: false,
  })
);
