import WSS from "./wss.js"

class webrtc {
    constructor () {
        this.DATA = {
            TYPE: 'CHAT',
            COD: null
        };
    }

    sendPreOffer = (obj) => {
        if (obj.type===undefined || obj.type===undefined ==='' || obj.cod===undefined || obj.cod==='') return console.error('webrtc->sendPreOffer: Type e Cod não podem ser nulos.');
        
        this.DATA.TYPE = obj.type;
        this.DATA.COD = obj.cod;

        WSS.sendPreOffer(this.DATA);
    }
}
export default new webrtc();