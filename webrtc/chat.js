"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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
let alice = new RTCPeerConnection(configuration);
let bob = new RTCPeerConnection(configuration);
let alicedata = null;
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
function acceptoffer(offer, pc) {
    return __awaiter(this, void 0, void 0, function* () {
        pc.setRemoteDescription(offer);
        let answer = yield pc.createAnswer(offer);
        yield pc.setLocalDescription(answer);
        return new RTCSessionDescription(answer);
    });
}
function createOffer(pc) {
    return __awaiter(this, void 0, void 0, function* () {
        const offer = yield pc.createOffer();
        yield pc.setLocalDescription(offer);
        return new RTCSessionDescription(offer);
    });
}
alice.addEventListener("negotiationneeded", (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Alice: negotiationneeded");
    console.log("alice:negotiate", event);
    const offer = yield createOffer(alice);
    console.log("Alice: offer created");
    let remote = yield acceptoffer(offer, bob);
    alice.setRemoteDescription(remote);
    console.log("Alice: remote description set");
    alicedata === null || alicedata === void 0 ? void 0 : alicedata.send("Hello Bob!");
}));
alice.addEventListener("icecandidate", (event) => {
    // TODO this
    bob.addIceCandidate(event.candidate);
    console.log("Alice: icecandidateis", event);
});
bob.addEventListener("icecandidate", (event) => {
    alice.addIceCandidate(event.candidate);
    console.log("Bob: icecandidateis", event);
});
bob.addEventListener("datachannel", (event) => {
    console.log("Bob: datachannel", event);
});
createOffer(alice)
    .then((offer) => {
    console.log(offer);
    return acceptoffer(offer, bob);
})
    .then((answer) => {
    alice.addEventListener("connectionstatechange", (event) => {
        console.log("connection sucsesful", event);
    });
    return answer;
})
    .then((answer) => {
    console.log(answer);
    return alice.setRemoteDescription(new RTCSessionDescription(answer));
})
    .then(() => {
    alicedata = alice.createDataChannel("test");
    alicedata.addEventListener("open", (eve) => {
        console.log("alicedata", eve);
    });
});
sleep(1000).then(() => {
    alicedata === null || alicedata === void 0 ? void 0 : alicedata.send("asdasfafkaf");
});
// async function makeCall() {
//   const configuration = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };
//   alice = new RTCPeerConnection(configuration);
//   alice.onicecandidate = (event) => {
//     console.log("Alice ICE candidate:", event);
//   };
//   alice.onnegotiationneeded = async () => {
//     console.log("Alice negotiation needed");
//   };
//   alice.onicegatheringstatechange = async () => {
//     console.log("Alice ICE gathering state changed:", alice.iceGatheringState);
//   };
//   const offer = await alice.createOffer();
//   await alice.setLocalDescription(offer);
//   // signalingChannel.send({ offer });
//   bob = new RTCPeerConnection(configuration);
//   bob.setRemoteDescription(new RTCSessionDescription(offer));
//   const answer = await bob.createAnswer();
//   await bob.setLocalDescription(answer); //
//   //add event listener
//   const remoteDesc = new RTCSessionDescription(answer);
//   await alice.setRemoteDescription(remoteDesc);
//   alice.addEventListener("connectionstatechange", (event) => {
//     console.log(event);
//   });
//   localStream1 = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   localStream1
//     .getTracks()
//     .forEach((track) => {
//       return alice.addTrack(track, localStream1);
//     });
//   console.log("elp");
//   console.log(alice.connectionState);
// }
// makeCall();
//# sourceMappingURL=chat.js.map