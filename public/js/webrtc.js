import VIEW from "./view.js";
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

        const acceptCallHandler =_=> {
            console.log('accept call');
        }
        const rejectCallHandler =_=> {
            console.log('reject call');
        }

        // se o tipo da chamada recebida for chat ou video
        if (TYPE==='CHAT' || TYPE==='VIDEO') {
            console.log('showing call dialog');
            VIEW.showIncomingCallDialog(TYPE, acceptCallHandler, rejectCallHandler);
        }
    }
}
export default new webrtc();