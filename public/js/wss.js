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

        socket.on('webRTC-signaling', (data) => {
            switch (data.type) {
                case 'OFFER':
                    WEBRTC.handleWebRTCOffer(data);
                    break;
                default:
                    return;
            }
        });
    }


    // --- enviando a oferta para o servidor
    sendPreOffer = (data) => {
        console.log("emmiting to server pre offer event");
        socketIO.emit("pre-offer", data);
    }

    sendPreOfferAnswer = (data) => {
        socketIO.emit('pre-offer-answer', (data));
    }

    sendDataUsingWebRTCSignaling = (data) => {
        socketIO.emit('webRTC-signaling', data);
    }
}
export default new wss();