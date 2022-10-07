export const getUserName = async (id: number) => {
  let url = `http://localhost:8000/user/${id}`;
  let user = await fetch(url).then((res) => res.json());

  return user;
};

interface Payload {
  userid: number;
  message: string;
  messageID: number;
}

interface Data {
  type: string;
  payload: Payload;
}

export interface User {
  userid: number;
  username: string;
  avatarURL: string;
}
interface Callbacks {
  userChange: CallableFunction[];
  newUser: CallableFunction[];
  newMessage: CallableFunction[];
}

export class Socket {
  private _username: string;
  userid: number;
  ws: WebSocket | undefined;
  callbacks: Callbacks;

  constructor() {
    this._username = "";
    this.userid = Date.now();
    this.ws = undefined;
    this.callbacks = {
      userChange: [],
      newUser: [],
      newMessage: [],
    };
  }
  set username(value: string) {
    this._username = value;
    this.ws = new WebSocket(
      `ws://localhost:8000/ws/0?username=${value}&id=${this.userid}`
    );
    this.callbacks.userChange.map((callback) => callback(this._username));
    this.onmessage();
  }
  get username() {
    return this._username;
  }
  send(data: any) {
    this.ws?.send(JSON.stringify(data));
  }

  on(e: "userChange" | "newUser" | "newMessage", callback: CallableFunction) {
    const { [e]: callbackArray } = this.callbacks; // @ts-ignore
    if (callbackArray.includes(callback)) return;
    callbackArray.push(callback);
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
            // li = createMessage(payload.message, user.username);
            console.log(payload.message);
            this.callbacks.newMessage.map((callback) =>
              callback(user, payload.message, payload.messageID)
            );
            break;

          case "user.new":
            this.callbacks.newUser.map((callback) => callback(user));
            li.appendChild(
              document.createTextNode(`${user.username} enterned the chat`)
            );
            li.className = "text-center";
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
