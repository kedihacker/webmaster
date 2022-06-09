function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Queue {
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

class Chatcontroller {
  outterhtml: HTMLDivElement;
  constructor(outterhtml: HTMLDivElement) {
    this.outterhtml = outterhtml;
  }
  sendmessage(message: string) {
    let messagehtml = document.createElement("div");
    messagehtml.className = "chat justright";
    let actualmessage = document.createElement("div");
    actualmessage.className = "sent";
    actualmessage.innerText = message;
    messagehtml.appendChild(actualmessage);

    this.outterhtml.appendChild(messagehtml);
  }
  recivemessage(message: string) {
    let messagehtml = document.createElement("div");
    messagehtml.className = "chat justleft";
    let actualmessage = document.createElement("div");
    actualmessage.className = "recived";
    actualmessage.innerText = message;
    messagehtml.appendChild(actualmessage);

    this.outterhtml.appendChild(messagehtml);
  }

  focuslastmessage() {
    (
      this.outterhtml.childNodes[
        this.outterhtml.childNodes.length - 1
      ] as HTMLDivElement
    ).scrollIntoView({ behavior: "auto" });
  }
}

let maincont = new Chatcontroller(
  document.getElementsByClassName("tophistory")[0] as HTMLDivElement
);

let chatbox = document.getElementsByClassName(
  "editbox"
)[0] as HTMLTextAreaElement;

chatbox.addEventListener("keydown", (event) => {
  if (!event.ctrlKey && !event.shiftKey && event.key === "Enter") {
    if (chatbox.value != "") {
      maincont.sendmessage(chatbox.value);
      maincont.focuslastmessage();
    }
    event.preventDefault();
    chatbox.value = "";
  }
  if (event.shiftKey && event.key === "Enter") {
    chatbox.value = chatbox.value + "\n";
  }
});
