var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const servers = {
    iceServers: [
        {
            urls: ["stun:stun.l.google.com:19302"],
        },
    ],
    iceCandidatePoolSize: 10,
};
class Queue {
    constructor() {
        this.queue = [];
    }
    addEventListener(message) {
        this.callback = message;
    }
    send(item) {
        this.queue.push(item);
        if (this.callback) {
            this.callback(this.remove());
        }
    }
    remove() {
        return this.queue.shift();
    }
    size() {
        return this.queue.length;
    }
}
let alice = null;
let bob = null;
let localStream1 = null;
let remoteStream1 = null;
let localStream2 = null;
let remoteStream2 = null;
let offer1 = null;
// // Set up an asynchronous communication channel that will be
// // used during the peer connection setup
const signalingChannel = new Queue();
// signalingChannel.addEventListener((message) => {
//   console.log("Received message from signaling channel:", message);
// });
// // Send an asynchronous message to the remote client
// signalingChannel.send("Hello!");
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function makeCall() {
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };
        alice = new RTCPeerConnection(configuration);
        const offer = yield alice.createOffer();
        yield alice.setLocalDescription(offer);
        // signalingChannel.send({ offer });
        bob = new RTCPeerConnection(configuration);
        bob.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = yield bob.createAnswer();
        yield bob.setLocalDescription(answer); //
        //add event listener
        const remoteDesc = new RTCSessionDescription(answer);
        yield alice.setRemoteDescription(remoteDesc);
        alice.addEventListener("connectionstatechange", (event) => {
            console.log(event);
        });
        yield sleep(1000);
        console.log("elp");
        console.log(alice.connectionState);
    });
}
makeCall();
//# sourceMappingURL=chat.js.map