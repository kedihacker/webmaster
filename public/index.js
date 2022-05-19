var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const constraints = {
    audio: false,
    video: true,
};
function handlesuccese(stream) {
    console.log(stream);
    const video = document.querySelector("video");
    const videoTracks = stream.getVideoTracks();
    console.log("Got stream with constraints:", constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    console.log("videoTracks", videoTracks);
    // make variable available to browser console
    video.srcObject = stream; //its like setiing a src of video to a file
}
function getstreamwithconstarints(constraints) {
    return __awaiter(this, void 0, void 0, function* () {
        return navigator.mediaDevices.getUserMedia(constraints);
    });
}
function init(e, constraint) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const video = document.querySelector("video");
            if (video.srcObject !== null) {
                video.srcObject.getTracks().forEach((track) => {
                    track.stop();
                });
            }
            const stream = yield getstreamwithconstarints(constraint);
            stream.getTracks().forEach((track) => {
                console.log("setting", track.getConstraints());
            });
            handlesuccese(stream);
        }
        catch (e) {
            console.log(e);
        }
    });
}
document
    .querySelector("#showVideo")
    .addEventListener("click", (e) => init(e, constraints));
document.getElementById("cheao cam").addEventListener("click", (e) => init(e, {
    video: { width: { exact: 4 }, height: { exact: 3 } },
    audio: false,
}));
//# sourceMappingURL=index.js.map