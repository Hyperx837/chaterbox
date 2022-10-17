import { Data, User } from "types";

export const getUserName = async (id: number): Promise<User> => {
  let url = `http://localhost:8000/user/${id}`;
  let user = await fetch(url).then((res) => res.json());

  return user;
};

export class Socket {
  user: User;
  ws: WebSocket | undefined;
  callbacks: { [key: string]: CallableFunction[] };
  lastMessageUser: User | undefined;

  constructor() {
    this.user = {
      id: Date.now(),
      avatar: "",
      set name(value: string) {
        this._username = value;
        socket.ws = new WebSocket(
          `ws://localhost:8000/ws/0?username=${value}&id=${this.id}`
        );
        socket.callbacks.userChange.map((callback) => callback(this.name));
        socket.onmessage();
      },
      get name() {
        return this._username;
      },
      _username: "",
    };
    this.ws = undefined;
    this.callbacks = {
      userChange: [],
      newUser: [],
      newMessage: [],
    };
  }
  send(data: any) {
    this.ws?.send(JSON.stringify(data));
  }

  on(e: string, callback: CallableFunction) {
    const { [e]: callbackArray } = this.callbacks;
    if (callbackArray.includes(callback)) return;
    callbackArray.push(callback);
  }
  onmessage() {
    if (!this.ws) return;

    this.ws.onmessage = (e) => {
      let { type, payload }: Data = JSON.parse(e.data);
      getUserName(payload.userid).then((user) => {
        if (this.user.id === payload.userid) return;
        switch (type) {
          case "message":
            this.callbacks.newMessage.map((callback) =>
              callback(
                user,
                payload.message,
                payload.messageID,
                this.lastMessageUser === this.user
              )
            );
            this.lastMessageUser = user;
            break;

          case "user.new":
            this.callbacks.newUser.map((callback) => callback(user));
            break;

          case "user.leave":
            break;
        }
      });
    };
  }
}

export const socket = new Socket();
