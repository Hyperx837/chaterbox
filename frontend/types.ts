export interface MessageComponent {
  avatar: string;
  msg: string;
  sentByUser: boolean;
  msgID: number;
}
interface Payload {
  userid: number;
  message: string;
  messageID: number;
}

export interface Data {
  type: string;
  payload: Payload;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  _username: string;
}
