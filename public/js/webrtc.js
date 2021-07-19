import VIEW from "./view.js";
import wss from "./wss.js";
import WSS from "./wss.js"

class webrtc {
    constructor () {
        this.peerConnection;
        this.connectedUserDetails;
        this.defaultConstraints = {
            audio: true,
            video: true
        };
        this.DATA = {
            TYPE: 'CHAT',
            COD: null
        };
        this.CONFIGURARION = {
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:13902'
                }
            ]
        }
    }

    getLocalPreview = () => {
        // --- pegando do navegador a stream de audio e video
        navigator.mediaDevices.getUserMedia(this.defaultConstraints)
        .then((stream) => {
            // --- chamando função que adiciona
            // --- a stream no componente de video
            // --- que representa o video local do usuário
            VIEW.updateLocalVideo(stream);
        }).catch(e => {
            console.error('Ocorreu um erro:' + e);
        });
    }

    // --- criando a conexão peer
    createPeerConnection = () => {
        this.peerConnection = new RTCPeerConnection(this.CONFIGURARION);

        this.peerConnection.onicecandidate = (event) => {
            console.log('geeting ice candidates from stun server');
            if (event.candidate) {
                // --- enviar o ice candidate para outro par
            }
        }

        this.peerConnection.onconnectionstatechange = (event) => {
            if (peerConnection.connectionState === 'connected') {
                console.log('Sucesso na conexão com o outro par');
            }
        }

        // recebendo midias
        const remoteStream = new MediaStream();
        VIEW.setRemoteStream(remoteStream);

        

        this.peerConnection.outrack = (event) => {
            remoteStream.addTrack(event.track);
        }

        // adicionando a stream do parceiro conectado
        if (this.connectedUserDetails.callType === 'VIDEO_PERSONAL_CODE') {
            const localStream = VIEW.getState().localStream;

            for (const track of localStream.getTracks()) {
                peerConnection.addTrack(track, localStream);
            }
        }
    }

    sendPreOffer = (obj) => {
        if (obj.type===undefined || obj.type===undefined ==='' || obj.cod===undefined || obj.cod==='') return console.error('webrtc->sendPreOffer: Type e Cod não podem ser nulos.');
        
        this.connectedUserDetails = {
            CODE: obj.type,
            TYPE: obj.cod
        };

        if (obj.type === 'CHAT' || obj.type === 'VIDEO') {
            this.DATA.TYPE = obj.type;
            this.DATA.COD = obj.cod;

            WSS.sendPreOffer(this.DATA);
        }
    }

    handlePreOffer = (data) => {
        const { TYPE, callerSocketID} = data;
        this.connectedUserDetails = {
            socketID: callerSocketID,
            TYPE
        };

        // se o tipo da chamada recebida for chat ou video
        if (TYPE==='CHAT' || TYPE==='VIDEO') {
            console.log('showing call dialog');
            VIEW.showIncomingCallDialog(TYPE);
        }
    }

    acceptCallHandler =_=> {
        console.log('accept call');
        this.sendPreOfferAnswer('CALL_ACCEPTED');
        this.createPeerConnection();
    }
    rejectCallHandler =_=> {
        console.log('reject call');
        this.sendPreOfferAnswer('CALL_REJECTED');
    }
    

    sendPreOfferAnswer = (preOfferAnswer) => {
        const data = {
            callerSocketID: this.connectedUserDetails.socketID,
            preOfferAnswer
        }
        WSS.sendPreOfferAnswer(data);
    }

    handlePreOfferAnswer = (data) => {
        const { preOfferAnswer } = data;
        console.log('pre offer answer came');
        console.log(data);

        // removendo a tela de chamada ao receber respostar da call
        // VIEW.removeCallDialog();

        if (preOfferAnswer === 'CALLEE_NOT_FOUND') {
            // mostrar dialogo de receptor não localizado
            VIEW.showCallDialog(preOfferAnswer, {
                accepted: false,
                rejected: false,
                ok: true
            });
        }

        if (preOfferAnswer === 'CALL_UNAVAILABLE') {
            // mostrar dialogo de receptor não foi capaz de conectar
            VIEW.showCallDialog(preOfferAnswer, {
                accepted: false,
                rejected: false,
                ok: true
            });
        }

        if (preOfferAnswer === 'CALL_REJECTED') {
            // mostrar dialogo de receptor recusou a conexão
            VIEW.removeCallDialog();
            VIEW.showCallDialog(preOfferAnswer, {
                accepted: false,
                rejected: false,
                ok: true
            });
        }

        if (preOfferAnswer === 'CALL_ACCEPTED') {
            // remove a tela de dialogo de chamada
            VIEW.removeCallDialog();
            VIEW.showActionButtons();
            this.createPeerConnection();
            this.sendWebRTCOffer();
        }
    }

    sendWebRTCOffer = async () => {
        const offer = await this.peerConnection.creatOffer();
        await this.peerConnection.setLocalDescription(offer);
        WSS.sendDataUsingWebRTCSignaling({
            connectedUserSocketID: this.connectedUserDetails.socketID,
            type: 'OFFER',
            offer: offer
        });
    }

    handlerWebRTCOffer = (data) => {
        console.log("webRTC offer came");
        console.log(data);
    };
}
export default new webrtc();