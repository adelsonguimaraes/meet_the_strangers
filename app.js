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
    
    // recebendo a pre-oferta
    socket.on('pre-offer', (data) => {
        const { COD, TYPE } = data;

        // verificando pelo id da oferta
        // se está conectado
        const connectedPeer = connectedPeers.find(
            (peerSocketID) => peerSocketID === COD
        );

        // se estiver conectado
        if (connectedPeer) {
            
            // montando o data com id do socket chamando
            // e o tipo da chamada
            const data = {
                callerSocketID: socket.id,
                TYPE
            };

            // enviando a oferta para o parceiro
            // que está sendo chamado
            io.to(COD).emit("pre-offer", data);
            
            // enviando confirmação de sucesso na chamada
            // para o usuário que está chamando
            const _data = {
                preOfferAnswer: 'CALLEE_FOUND'
            }
            io.to(socket.id).emit("pre-offer-answer", _data);
        }else{
            // --- se o parceiro não for encontrado
            const data = {
                preOfferAnswer: 'CALLEE_NOT_FOUND',
            };
            io.to(socket.id).emit('pre-offer-answer', data);
        }
    });


    // resposta da oferta de conexão
    socket.on('pre-offer-answer', (data) => {
        // desestrutura o socketID do parceiro
        // que fez a oferta
        const { callerSocketID } = data;

        // verificando pelo id da oferta
        // se ainda está conectado
        const connectedPeer = connectedPeers.find(
            (peerSocketID) => peerSocketID === callerSocketID
        );

        // se ainda estiver conectado emit um sinal de resposta
        if (connectedPeer) {
            io.to(callerSocketID).emit('pre-offer-answer', data);
        }
    });

    // recendo um sinal handshake web rtc (aperto de mao)
    socket.on('WebRTC-signaling', (data) => {
        
        // desestruturando o connecedUserSocketID
        const { connectedUserSocketID } = data;

        // verificando se o mesmo está conectado
        const connectedPeer = connectedPeers.find(
            (peerSocketID) => peerSocketID === connectedUserSocketID
        );

        // se estiver conectado emitimos um sinal para o usuário
        if (connectedPeer) {
            console.log("emmiting handshake to user");
            io.to(connectedUserSokectID).emit('webRTC-signaling', data);
        }
    });

    // caso haja uma desconexão
    // do socket por algum motivo
    // do lado cliente
    socket.on('disconnect', () => {
        console.log('user disconnected');

        const newConnectedPeers = connectedPeers.filter(
            (peerSocketId) => peerSocketId !== socket.io
        );

        connectedPeers = newConnectedPeers;
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

