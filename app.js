const express = require('express');
const http = require('http');

// porta default 3000
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); // criando um servidor express
const io = require('socket.io')(server); // conectando o socket.io ao server express

// get recebendo objeto de resposta
app.get('/', (req, res) => {
    // partindo da raiz do projeto e acessando a pasta 'public'
    // devolvendo o arquivo index.html
    res.sendFile(__dirname +  '/public/index.html');
});

let connectedPeers = [];

// quando houver uma conexão com sucessso
// accessando pelo socket retornado podemos pegar o id
io.on('connection', (socket) => {
    // adicioando os peers conectados
    connectedPeers.push(socket.id);
    console.log(connectedPeers);

    // caso haja uma desconexão
    // do socket por algum motivo
    // do lado cliente
    socket.on('disconnect', () => {
        console.log('user disconnected');

        const newConnectedPeers = connectedPeers.filter((peerSocketId) => {
            peerSocketId !== socket.io;
        });

        connectedPeers = newConnectedPeers;
        console.log(connectedPeers);
    });
});

/*
    NODEMON - REINICIA O SERVIDOR AUTOMATICAMENTE A CADA ATUALIZAÇÃO
    -----------
    Para colocar o NODEMON para funcionar
    adicionar em package.json em "scripts"
    um atributo "start": "nodemon app.js"
    referenciando o arquivo principal do servidor
    em seguida startar o servidor com
    NPM START
*/


// configurando o servidor para permitir
// acesso aos arquivos da pasta 'public'
// fora do servidor (por padrão não é possível)
app.use(express.static('public'));

// iniciando o servidor com metodo listen
// passando a porta onde ele deve ser iniciado
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

