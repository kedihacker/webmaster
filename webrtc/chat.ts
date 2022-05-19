const servers = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc2 = new RTCPeerConnection(servers);
const pc1 = new RTCPeerConnection(servers);
let localStream1 = null;
let remoteStream1 = null;
let localStream2 = null;
let remoteStream2 = null;
let offer1: RTCSessionDescriptionInit = null;
pc1.createOffer().then((offer): void => {
  console.log(offer);
  pc1.setLocalDescription(offer);
  offer1 = offer;
});

pc2.setRemoteDescription({
  type: "offer",
  sdp: offer1.sdp,
});

pc1.onicecandidate = (e) => {
  console.log(e);
};
