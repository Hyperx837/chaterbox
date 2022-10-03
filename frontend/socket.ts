export const getUserName = async (id: number) => {
  let url = `http://localhost:8000/user/${id}`;
  let user = await fetch(url).then((res) => res.json());

  return user;
};

interface Payload {
  userid: number;
  message: string;
}

interface Data {
  type: string;
  payload: Payload;
}

export interface User {
  userid: number;
  username: string;
  avatar_url: string;
}

export class Socket {
  private _username: string;
  userid: number;
  ws: WebSocket | undefined;
  userCallbacks: CallableFunction[];
  newUserCallbacks: CallableFunction[];

  constructor() {
    this._username = "";
    this.userid = Date.now();
    this.ws = undefined;
    this.userCallbacks = [];
    this.newUserCallbacks = [];
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
  send(data: any) {
    if (this.ws) this.ws.send(JSON.stringify(data));
  }
  onNewUser(callback: CallableFunction) {
    if (this.newUserCallbacks.includes(callback)) return;
    this.newUserCallbacks.push(callback);
  }
  onUserChange(callback: CallableFunction) {
    if (this.userCallbacks.includes(callback)) return;
    this.userCallbacks.push(callback);
  }
  onmessage() {
    if (!this.ws) return;

    this.ws.onmessage = (e) => {
      let li = document.createElement("li");
      let { type, payload }: Data = JSON.parse(e.data);
      getUserName(payload.userid).then((user: User) => {
        if (this.userid === payload.userid) return;
        switch (type) {
          case "message":
            li = createMessage(payload.message, user.username);
            break;

          case "user.new":
            // console.log(user);
            this.newUserCallbacks.map((callback) => callback(user));
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

export function createMessage(message: string, username: string) {
  let li = document.createElement("li");
  let msg = `${username}: ${message}`;
  li.appendChild(document.createTextNode(msg));
  return li;
}

export const socket = new Socket();
