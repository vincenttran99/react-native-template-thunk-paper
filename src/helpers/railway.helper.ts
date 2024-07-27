
const URL_SERVER = "https://web-production-94d6.up.railway.app/";

export const globalApp : CustomLog = {
  customLog: null
};

interface CustomLog {
  customLog: any;
}

class logs {
  _socket: any;
  enableLog: boolean;
  _urlSocket: string;
  constructor() {
    this._socket = undefined;
    this.enableLog = false;
    this._urlSocket = URL_SERVER;

    globalApp.customLog = this;
  }

  enableLogger() {
    this.enableLog = true;
  }

  disableLogger() {
    this.enableLog = false;
  }

  connect(dataHome: any) {
    const newUrlSocket = URL_SERVER;

    if (newUrlSocket !== this._urlSocket) {
      this._urlSocket = newUrlSocket;
      this._socket.disconnect();
      this._socket = undefined;
      this.disableLogger();
    }

    console.log("Socket connecting", this._urlSocket);

    if (!this._socket) {
      this._socket = require("socket.io-client")(`${this._urlSocket}`);

      console.log("socket connect-->", this._socket);
      this._socket.on("connection", (data: any) => {
        console.log("app conection to server");
      });
      this.enableLogger();

      this._socket.emit("event_from_app", "App connected");
      this._socket.emit("user_connect", dataHome);

      this._socket.on("event_from_app_to_app", (data: any) => {
        console.log("event_from_app_to_app", data);
      });

      this._socket.on("event_from_web_to_app", (data: any) => {
        console.log("event_from_web_to_app", data);
        if (data.type === "disconnect") {
          this.disconnect();
        }
      });
    } else {
      console.log("Socket app had init");
      this._socket.emit("event_from_app", "Socket app had init");
    }
  }

  disconnect() {
    if (this._socket) {
      this._socket.disconnect();
      this._socket = undefined;
      this.disableLogger();
    }
  }

  emitEvent(data: any) {
    if (this._socket) {
      this._socket.emit("event_from_app", data);
    }
  }
}

// eslint-disable-next-line new-cap
export default new logs();
