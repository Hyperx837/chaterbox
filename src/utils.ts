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
  onmessage(callback: any) {
    if (this.ws) {
      this.ws.onmessage = callback;
    }
  }
}

export const socket = new Socket();
