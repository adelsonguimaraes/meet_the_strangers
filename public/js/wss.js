import VIEW from './view.js';
import WEBRTC from './webrtc.js';

let socketIO = null;

class wss {
    constructor () {

    }

    registerSocketsEvents = (socket) => {
        socketIO = socket;
        
        socket.on("connect", _=> {
            console.log("Succesfully connected to socket.io server");
            VIEW.setSocketID(socket.id);
        });

        socket.on('pre-offer', (data) => {
            WEBRTC.handlePreOffer(data);
        })

        socket.on('pre-offer-answer', (data) => {
            WEBRTC.handlePreOfferAnswer(data);
        });
    }


    sendPreOffer = (data) => {
        console.log("emmiting to server pre offer event");
        socketIO.emit("pre-offer", data);
    }

    sendPreOfferAnswer = (data) => {
        socketIO.emit('pre-offer-answer', (data));
    }
}
export default new wss();