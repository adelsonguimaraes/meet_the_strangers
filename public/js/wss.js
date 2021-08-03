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

        // --- recebendo uma oferta de chamada
        socket.on('pre-offer', (data) => {
            WEBRTC.handlePreOffer(data);
        })

        socket.on('pre-offer-answer', (data) => {
            WEBRTC.handlePreOfferAnswer(data);
        });

        // recebendo sinal de aperto de mao do webrtc
        socket.on('webRTC-signaling', (data) => {

            console.log(data);

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

    // enviando a resposta da oferta
    sendPreOfferAnswer = (data) => {
        console.log("emmiting to server ANSWER pre offer event");
        socketIO.emit('pre-offer-answer', (data));
    }

    // enviando oferta de aperto de mao WebRTC
    sendDataUsingWebRTCSignaling = (data) => {
        console.log("emmiting to server offer handshake", data);
        socketIO.emit('WebRTC-signaling', data);
    }
}
export default new wss();