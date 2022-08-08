const getUserName = async (id: number | undefined) => {
  if (!id) return;
  return await fetch(`http://localhost:8000/user/${id}`, {
    method: "GET",
  }).then((res) => res.json());
};

interface Data {
  type: string;
  payload: {
    userid: number;
    message: string;
  };
}

export class Socket {
  private _username: string;
  userid: number;
  ws: WebSocket | undefined;
  userCallbacks: CallableFunction[];

  constructor() {
    this._username = "";
    this.userid = Date.now();
    this.ws = undefined;
    this.userCallbacks = [];
  }
  set username(value: string) {
    this._username = value;
    this.ws = new WebSocket(
      `ws://localhost:8000/ws/0?username=${value}&id=${this.userid}`
    );
    this.userCallbacks.map((callback) => callback(this._username));
    this.onmessage();
  }
  get username() {
    return this._username;
  }
  onUserChange(callback: CallableFunction) {
    this.userCallbacks.push(callback);
  }
  send(data: any) {
    if (this.ws) this.ws.send(JSON.stringify(data));
  }
  onmessage() {
    if (!this.ws) return;

    this.ws.onmessage = (e) => {
      console.log(e.data);
      let li = document.createElement("li");
      let { type, payload }: Data = JSON.parse(e.data);
      getUserName(payload.userid).then((user) => {
        switch (type) {
          case "message":
            let msg = `${
              payload.userid === this.userid ? "You" : user.username
            }: ${payload.message}`;
            li.appendChild(document.createTextNode(msg));
            li.className = payload.userid === this.userid ? "right" : "";
            break;

          case "user.new":
            li.appendChild(
              document.createTextNode(`${user.username} enterned the chat`)
            );
            break;

          case "user.leave":
            li.appendChild(
              document.createTextNode(`${user.username} left the chat`)
            );
            li.className = "text-center";
            break;
        }
        let msgs = document.getElementById("msgs");
        if (msgs) msgs.appendChild(li);
      });
    };
  }
}

export const socket = new Socket();
