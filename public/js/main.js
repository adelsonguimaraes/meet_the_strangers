import WSS from './wss.js';
import WEBRCT from './webrtc.js';


// quando colocamos apenas a / no lugar do host e porta (localhost:3000)
// e estiver no mesmo diretório, ele encontrará
// automaticamente a porta
const socket = io('/');

// chamando função para iniciar video e audio do usuário
WEBRCT.getLocalPreview();

// chamando função para registro do socket
WSS.registerSocketsEvents(socket);