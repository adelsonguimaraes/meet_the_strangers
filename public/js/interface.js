class view {
    constructor () {
        this.PERSONAL_CODE = document.querySelector('#personal_code');
        this.EXTERNAL_CODE = document.querySelector('#personal_code_input');
        this.RECORD_ACTIONS = document.querySelector('.record_actions');
        this.NO_CALL = document.querySelector('.no_call');
        
        // stats
        this.CALL = false;
        this.MIC = true; // inicia ativado
        this.GRAVAR = false;

        // botoes
        this.BTN_MIC = document.querySelector('.mic');
        this.BTN_FOTO = document.querySelector('.foto');
        this.BTN_CALL = document.querySelector('.call');
        this.BTN_CAMERA = document.querySelector('.camera');
        this.BTN_GRAVAR = document.querySelector('.gravar');
    
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
}
const VIEW = new view();