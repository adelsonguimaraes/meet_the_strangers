class view {
    constructor () {
        this.PERSONAL_CODE = document.querySelector('#personal_code');
        this.EXTERNAL_CODE = document.querySelector('#personal_code_input');
        this.CHATBOX = document.querySelector('.chatbox');
        this.RECORD_ACTIONS = document.querySelector('.record_actions');
        this.TOAST = document.querySelector('.toast');
        this.NO_CALL = document.querySelector('.no_call');
        
        // stats
        this.CALL = false;
        this.MIC = true; // inicia ativado
        this.GRAVAR = false;
        this.MSGS = [];

        // status da aplicacao
        this.state = {
            socketID: null,
            localStream: null,
            remoteStream: null,
            screenSharingStream: null,
            allowConnectionsFromStrangers: false,
            screenSharingActive: false
        };

        // botoes
        this.BTN_MIC = document.querySelector('.mic');
        this.BTN_FOTO = document.querySelector('.foto');
        this.BTN_CALL = document.querySelector('.call');
        this.BTN_CAMERA = document.querySelector('.camera');
        this.BTN_GRAVAR = document.querySelector('.gravar');
    }

    setSocketID = (socketID) => {
        this.state = {
            ...this.state,
            socketID,

        };
        this.setPersonalCode (socketID);
    };

    setLocalStream = (stream) => {
        this.state = {
            ...this.state,
            localStream: stream
        }
    }

    setAllowConnectionsFromStranges = (allowConnection) => {
        this.state = {
            ...this.state,
            allowConnectionsFromStrangers: allowConnection
        }
    }

    setScreenSharingActive = (screenSharingActive) => {
        this.state = {
            ...this.state,
            screenSharingActive,
        }
    }

    setScreenSharingStream = (stream) => {
        this.state = {
            ...this.state,
            screenSharingStream: stream,
        }
    }

    setRemoteStream = (stream) => {
        this.state = {
            ...this.state,
            remoteStream: stream
        }
    }

    getState = _=> {
        return this.state;
    }

    toastShow = (msg) =>{
        this.TOAST.innerHTML = msg;
        this.TOAST.classList.add('toast_show');
        setTimeout(_=>{
            this.TOAST.classList.remove('toast_show');
        }, 3000);
    }


    // retornar o código pessoal contido no elemento
    getPersonalCode () {
        return this.PERSONAL_CODE.innerText;
    }

    // atualiza o código pessoal contigo no elemento
    setPersonalCode (code) {
        this.PERSONAL_CODE.innerHTML = code;
        return this;
    }
    // retornando o código externo inserido no input
    getExternalCode () {
        return this.EXTERNAL_CODE.value;
    }

    showNoCall () {
        this.NO_CALL.classList.add('no_call_show');
    }
    hideNoCall () {
        this.NO_CALL.classList.remove('no_call_show');
    }

    connectingChat () {
        if (this.CALL) return alert('Não permitido durante call.');
        console.log('conectando ao chat externo ' + this.getExternalCode());
    }
    connectingVideo () {
        if (this.CALL) return alert('Não permitido durante call.');
        console.log('conectando ao video externo ' + this.getExternalCode());
    }
    connectingChatStanger () {
        if (this.CALL) return alert('Não permitido durante call.');
        console.log('conectando ao chat com desconhecido');
    }
    connectingVideoStanger () {
        if (this.CALL) return alert('Não permitido durante call.');
        console.log('conectando ao video com desconhecido');
    }

    // chat
    addChatMensage (msg, local) {
        this.MSGS.push(msg);
        let li = document.createElement('li');
        let date = new Date();
        let h = date.getHours(); h = (h<10) ? ('0'+h) : h;
        let m = date.getMinutes(); m = (m<10) ? ('0'+m) : m;
        let s = date.getSeconds(); s = (s<10) ? ('0'+s) : s;
        li.innerHTML = `
            <div>
                <a>${msg}</a>
                <p>${h}:${m}:${s}</p>
            </div>
        `;
        if (local) li.classList.add('local');
        this.CHATBOX.querySelector('ul').appendChild(li);
        this.CHATBOX.querySelector('ul').scrollTo({ top: this.CHATBOX.querySelector('ul').scrollHeight, behavior: 'smooth' })
    }
    getInputMsg () {
        return this.CHATBOX.querySelector('input').value;
    }
    setInputMsg (msg) {
        this.CHATBOX.querySelector('input').value = msg;
        return this;
    }

    clickCopyPersonalCode = _=> {
        const personalCode = this.getState().socketID;
        navigator.clipboard && navigator.clipboard.writeText(personalCode);
        this.toastShow('Código copiado!');
    }

    // actions call
    clickMic () {
        // se o mic estiver ativo
        if (this.MIC) {
            this.BTN_MIC.classList.add('btn_red');
            this.BTN_MIC.querySelector('img').src = './utils/images/micOff.png';
            this.MIC = false;
            console.log('desativando mic');
        }else{
            this.BTN_MIC.classList.remove('btn_red');
            this.BTN_MIC.querySelector('img').src = './utils/images/mic.png';
            this.MIC = true;
            console.log('ativando mic');
        }
    }
    clickGravar () {
        if (!this.GRAVAR) {
            this.RECORD_ACTIONS.classList.add('record_actions_show');
            this.GRAVAR = true;
            console.log('ativando gravação');
        }
    }
    clickStopGravar () {
        if (this.GRAVAR) {
            this.RECORD_ACTIONS.classList.remove('record_actions_show');
            this.GRAVAR = false;
            console.log('parando gravação');
        }
    }
    clickEnviar () {
        let msg = this.getInputMsg(); // recuperando a msg do input
        if (msg==='') return false;
        this.setInputMsg(''); // limpando a msg do input

        console.log(msg);

        this.addChatMensage(msg, true);
    }
}
const VIEW = new view();