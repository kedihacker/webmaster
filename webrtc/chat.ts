const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

class Queuebad {
  queue: any[];
  callback: Function | undefined;
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

let alice: RTCPeerConnection = new RTCPeerConnection(configuration);
let bob: RTCPeerConnection = new RTCPeerConnection(configuration);
let alicedata: RTCDataChannel | null = null;
let bobdatarec: RTCDataChannel | null = null;
// // Set up an asynchronous communication channel that will be
// // used during the peer connection setup
const signalingChannel = new Queuebad();
// signalingChannel.addEventListener((message) => {
//   console.log("Received message from signaling channel:", message);
// });

// // Send an asynchronous message to the remote client
// signalingChannel.send("Hello!");
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function acceptoffer(
  offer: RTCSessionDescription,
  pc: RTCPeerConnection
): Promise<RTCSessionDescription> {
  pc.setRemoteDescription(offer);
  let answer = await pc.createAnswer(offer);
  await pc.setLocalDescription(answer);
  return new RTCSessionDescription(answer);
}

async function createOffer(
  pc: RTCPeerConnection
): Promise<RTCSessionDescription> {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return new RTCSessionDescription(offer);
}

alice.addEventListener("negotiationneeded", async (event) => {
  console.log("Alice: negotiationneeded");
  console.log("alice:negotiate", event);
  const offer = await createOffer(alice);
  console.log("Alice: offer created");
  let remote = await acceptoffer(offer, bob);
  alice.setRemoteDescription(remote);
  console.log("Alice: remote description set");
  alicedata?.send("Hello Bob!");
});

alice.addEventListener("icecandidate", (event) => {
  // TODO this
  bob.addIceCandidate(event.candidate as RTCIceCandidate);
  console.log("Alice: icecandidateis", event);
});

bob.addEventListener("icecandidate", (event) => {
  alice.addIceCandidate(event.candidate as RTCIceCandidate);
  console.log("Bob: icecandidateis", event);
});

bob.addEventListener("datachannel", (event) => {
  bobdatarec = event.channel;
  bobdatarec.addEventListener("message", (event) => {
    console.log("Bob: recived message", event);
  });
  console.log("Bob:recived datachannel", event.channel);
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
      console.log("alicedata channel openedd", eve);
    });
  });

sleep(1000).then(() => {
  alicedata?.send("testdata efter 1 second");
});

const textmsgbox: HTMLTextAreaElement = document.getElementsByClassName(
  "editbox"
)[0] as HTMLTextAreaElement;
console.log(textmsgbox);
textmsgbox?.addEventListener("keydown", (event) => {
  // console.log(event.keyCode)
  if (!event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    console.log("why", textmsgbox.value);
    alicedata?.send(textmsgbox.value);
    textmsgbox.value = "";
  }

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
