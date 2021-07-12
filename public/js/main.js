import VIEW from './view.js';


// quando colocamos apenas a / no lugar do host e porta (localhost:3000)
// e estiver no mesmo diretório, ele encontrará
// automaticamente a porta
const socket = io('/');

// quando o servidor socket responder que houve uma conexão com sucesso
socket.on('connect', () => {
    console.log('succesfully connected to socket.io server'); 
    VIEW.setSocketID(socket.id);
});

document.querySelector('.menu-action').addEventListener('click', e => {
    const menu = document.querySelector('.menu');
    const cls = Array.from(menu.classList).filter(e => e==='menu-show');
    if (cls.length>0) {
        menu.classList.remove('menu-show');
     }else{
        menu.classList.add('menu-show');
     }
});