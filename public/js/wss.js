import VIEW from './view.js';

let socketIO = null;

class wss {
    constructor () {

    }

    registerSocketsEvents = (socket) => {
        socket.on("connect", _=> {
            socketIO = socket;

            console.log("Succesfully connected to socket.io server");
            VIEW.setSocketID(socket.id);
        });
    }


    sendPreOffer = (data) => {
        socketIO.emit("pre-offer", data);
    }
}
export default new wss();