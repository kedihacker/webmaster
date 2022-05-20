const servers = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

class Queue {
  queue: any[];
  callback: Function;
  constructor() {
    this.queue = [];
  }
  addEventListener(message: Function) {
    this.callback = message;
  }
  send(item: any) {
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
let offer1: RTCSessionDescriptionInit = null;

// // Set up an asynchronous communication channel that will be
// // used during the peer connection setup
const signalingChannel = new Queue();
// signalingChannel.addEventListener((message) => {
//   console.log("Received message from signaling channel:", message);
// });

// // Send an asynchronous message to the remote client
// signalingChannel.send("Hello!");
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function makeCall() {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  alice = new RTCPeerConnection(configuration);

  const offer = await alice.createOffer();
  await alice.setLocalDescription(offer);
  // signalingChannel.send({ offer });
  bob = new RTCPeerConnection(configuration);
  bob.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await bob.createAnswer();
  await bob.setLocalDescription(answer); //
  //add event listener
  const remoteDesc = new RTCSessionDescription(answer);

  await alice.setRemoteDescription(remoteDesc);
  alice.addEventListener("connectionstatechange", (event) => {
    console.log(event);
  });
  await sleep(1000)
  console.log("elp")
  console.log(alice.connectionState)
}

makeCall();
