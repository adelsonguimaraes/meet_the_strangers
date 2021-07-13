import VIEW from "./view.js";
import wss from "./wss.js";
import WSS from "./wss.js"

class webrtc {
    constructor () {
        this.connectedUserDetails;
        this.DATA = {
            TYPE: 'CHAT',
            COD: null
        };
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
            VIEW.showCallDialog(preOfferAnswer, {
                accepted: false,
                rejected: false,
                ok: true
            });
        }

        if (preOfferAnswer === 'CALL_ACCEPTED') {
            // enviar oferta
        }
    }
}
export default new webrtc();