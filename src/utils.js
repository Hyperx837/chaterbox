export class Socket {
  constructor() {
    this._username = "";
    this.userid = Date.now();
    this._wsURL = `ws://localhost:8000/user/${this._username}`;
    this.ws = undefined;
    this.userCallbacks = [];
  }
  set username(value) {
    this._wsURL = `ws://localhost:8000/user/${value}`;
    this._username = value;
    this.ws = new WebSocket(this._wsURL);
    this.userCallbacks.map((callback) => callback(this._username));
  }
  get username() {
    return this._username;
  }
  onUserChange(callback) {
    this.userCallbacks.push(callback);
  }
  send(data) {
    this.ws.send(JSON.stringify(data));
  }
  onmessage(callback) {
    this.ws.onmessage = callback;
  }
}

export const socket = new Socket();
