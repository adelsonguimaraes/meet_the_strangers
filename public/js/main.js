// quando colocamos apenas a / no lugar do host e porta (localhost:3000)
// e estiver no mesmo diretório, ele encontrará
// automaticamente a porta
const socket = io('/');

// quando o servidor socket responder que houve uma conexão com sucesso
socket.on('connect', () => {
    console.log('succesfully connected to socket.io server'); 
    console.log(socket.id );
});