import WEBRTC from "./webrtc.js";

class view {
    constructor () {
        this.PERSONAL_CODE = document.querySelector('#personal_code');
        this.EXTERNAL_CODE = document.querySelector('#personal_code_input');
        this.CHATBOX = document.querySelector('.chatbox');
        this.RECORD_ACTIONS = document.querySelector('.record_actions');
        this.CHAMADA_MODAL = document.querySelector('.chamada');
        this.MENU = document.querySelector('.menu');
        this.NO_CALL = document.querySelector('.no_call');

        // media
        this.LOCAL_VIDEO = document.querySelector('video.video_local');
        this.REMOTE_VIDEO = document.querySelector('video.video_remote');

        this.TOAST = {
            el: document.querySelector('.toast'),
            show: false,
            timer: null
        }
        
        // stats
        this.CALL = false;
        this.MIC = true; // inicia ativado
        this.GRAVAR = false;
        this.MSGS = [];
        this.AUDIO = null;

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
        this.CALL_ACTIONS = document.querySelector('div.call_actions');
        this.BTN_MIC = document.querySelector('.mic');
        this.BTN_FOTO = document.querySelector('.foto');
        this.BTN_CALL = document.querySelector('.call');
        this.BTN_CAMERA = document.querySelector('.camera');
        this.BTN_GRAVAR = document.querySelector('.gravar');
        this.BTN_STOP_GRAVAR = document.querySelector('button.btn_stop_gravar');
        this.BTN_ENVIAR = document.querySelector('button.btn_enviar');
        this.BTN_CONNECTIONG_CHAT = document.querySelector('button.btn_connecting_chat');
        this.BTN_CONNECTIONG_VIDEO = document.querySelector('button.btn_connecting_video');

        // açoes da tela
        this.toggleMenu();
        this.clickCopyPersonalCode();
        this.clickMic();
        this.clickGravar();
        this.clickStopGravar();
        this.clickEnviar();
        this.connectingChat();
        this.connectingVideo();
    }

    // setando no state o id do socket
    setSocketID = (socketID) => {
        this.state = {
            ...this.state,
            socketID,

        };
        // setando no documento o socket registrado
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

    // atualizando o video local
    updateLocalVideo = (stream) => {
        // adicionando como source a stream
        this.LOCAL_VIDEO.srcObject = stream;

        // ao carregar os dados, acionar o player
        this.LOCAL_VIDEO.addEventListener("loadedmetadata", _=> {
            this.LOCAL_VIDEO.play();
        });
    }

    updateRemoteVideo = (stream) => {
        // adicionando como source a stream remota
        this.REMOTE_VIDEO.srcObject = stream;
    }

    // mensagens/alertas em toast
    toastShow = (msg) =>{
        this.TOAST.el.innerHTML = msg;
        this.TOAST.el.classList.add('toast_show');
        if (this.TOAST.show) {
            clearTimeout(this.TOAST.timer);
            this.TOAST.timer = null;
        }
        this.TOAST.timer = setTimeout(_=>{
            this.TOAST.el.classList.remove('toast_show');
            clearTimeout(this.TOAST.timer);
            this.TOAST.timer = null;
        }, 3000);
    }

    // mostrar botões de ação
    showActionButtons =_=> {
        this.CALL_ACTIONS.classList.add('call_actions_show');
    }

    showActionAllButtons =_=> {
        this.CALL_ACTIONS.querySelector('button.mic').classList.add('button-show');
        this.CALL_ACTIONS.querySelector('button.foto').classList.add('button-show');
        this.CALL_ACTIONS.querySelector('button.camera').classList.add('button-show');
        this.CALL_ACTIONS.querySelector('button.gravar').classList.add('button-show');
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

    connectingChat =_=> {
        this.BTN_CONNECTIONG_CHAT.addEventListener('click', _=> {
            if (this.CALL) return alert('Não permitido durante call.');

            WEBRTC.sendPreOffer({
                type: 'CHAT',
                cod: this.getExternalCode()
            });

            // mostando tela de chamada
            this.showCallDialog(`Chamando Chat`, {
                accepted: false,
                rejected: true,
                ok: false
            });
        });
    }
    connectingVideo =_=> {
        this.BTN_CONNECTIONG_VIDEO.addEventListener('click', _=> {
            if (this.CALL) return alert('Não permitido durante call.');
            WEBRTC.sendPreOffer({
                type: 'VIDEO',
                cod: this.getExternalCode()
            });
            
            // mostando tela de chamada
            this.showCallDialog(`Chamando Vídeo`, {
                accepted: false,
                rejected: true,
                ok: false
            });
        });
    }
    connectingChatStanger () {
        if (this.CALL) return alert('Não permitido durante call.');
        console.log('conectando ao chat com desconhecido');
    }
    connectingVideoStanger () {
        if (this.CALL) return alert('Não permitido durante call.');
        console.log('conectando ao video com desconhecido');
    }

    showCallDialog = (TITLE, BUTTONS) => {

        const btn_accept = `
            <button class="btn_accept_call">
                <img src="./utils/images/acceptCall.png">
            </button>
        `;
        const btn_reject = `
            <button class="btn_reject_call">
                <img src="./utils/images/rejectCall.png">
            </button>
        `;
        const btn_ok = `
            <button class="btn_ok">
                Fechar
            </button>
        `;

        const chamada = document.createElement('div');
        chamada.classList.add('chamada');
        chamada.innerHTML = `
            <div class="content">
                <p>${TITLE}</p>
                <img class="avatar" src="./utils/images/dialogAvatar.png">
                <div class="buttons">
                    ${(BUTTONS.accepted) ? btn_accept : ''}
                    ${(BUTTONS.rejected) ? btn_reject : ''}
                    ${(BUTTONS.ok) ? btn_ok : ''}
                </div>
            </div>
        `;

        
        // if (this.CHAMADA_MODAL!==null) this.CHAMADA_MODAL.remove();
        
        document.body.appendChild(chamada);
        this.CHAMADA_MODAL = chamada;

        if (BUTTONS.accepted) this.clickAcceptCall();
        if (BUTTONS.rejected) this.clickRejectCall();
        if (BUTTONS.ok) this.clickOkCall();

        // this.CHAMADA_MODAL.classList.add('chamada_show');
    }

    playSound = _=> {
        console.log("sucesso na chamada");

        this.AUDIO = new Audio('./../utils/sons/ringtone.mp3');
        this.AUDIO.volume = 0.3;
        this.AUDIO.loop = true;
        this.AUDIO.play();
    }

    showIncomingCallDialog = (TYPE) => {
        console.log("getting incoming call dialog");

        this.showCallDialog(`Chamada de ${TYPE}`, {
            accepted: true,
            rejected: true,
            ok: false
        });
    }
    clickAcceptCall =_=> {
        document.querySelector('button.btn_accept_call').addEventListener('click', _=> {
            console.log('chamada aceita');
            WEBRTC.acceptCallHandler();
            this.removeCallDialog();
            this.showActionButtons();
        });
    }
    clickRejectCall =_=> {
        document.querySelector('button.btn_reject_call').addEventListener('click', _=> {
            console.log('chamada rejeitada');
            WEBRTC.rejectCallHandler();
            this.removeCallDialog();
        });
    }
    clickOkCall =_=>{
        document.querySelector('button.btn_ok').addEventListener('click', _=>{
            this.removeCallDialog();
        });
    }
    removeCallDialog =_=> {
        if (this.CHAMADA_MODAL!==null) this.CHAMADA_MODAL.remove();
        if (this.AUDIO!==null) {
            this.AUDIO.pause();
            this.AUDIO = null;
        }
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
        document.querySelector('button.btn-copy').addEventListener('click', _=> {
            const personalCode = this.getState().socketID;
            navigator.clipboard && navigator.clipboard.writeText(personalCode);
            this.toastShow('Código copiado!');
        });
    }

    // actions call
    clickMic () {
        this.BTN_MIC.addEventListener('click', _=> {
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
        });
    }
    clickGravar () {
        this.BTN_GRAVAR.addEventListener('click', _=> {
            if (!this.GRAVAR) {
                this.RECORD_ACTIONS.classList.add('record_actions_show');
                this.GRAVAR = true;
                console.log('ativando gravação');
            }
        });
    }
    clickStopGravar () {
        this.BTN_STOP_GRAVAR.addEventListener('click', _=> {
            if (this.GRAVAR) {
                this.RECORD_ACTIONS.classList.remove('record_actions_show');
                this.GRAVAR = false;
                console.log('parando gravação');
            }
        });
    }
    clickEnviar () {
        this.BTN_ENVIAR.addEventListener('click', _=> {
            let msg = this.getInputMsg(); // recuperando a msg do input
            if (msg==='') return false;
            this.setInputMsg(''); // limpando a msg do input
            this.addChatMensage(msg, true);
        });
    }


    // ---- menu
    toggleMenu =_=> {
        this.MENU.querySelector('.menu-action').addEventListener('click', _=> {
            let cls = Array.from(this.MENU.classList).filter(e => e==='menu-show');
            if (cls.length>0) {
                this.MENU.classList.remove('menu-show');
            }else{
                this.MENU.classList.add('menu-show');
            }
        });
    }
}
export default new view();