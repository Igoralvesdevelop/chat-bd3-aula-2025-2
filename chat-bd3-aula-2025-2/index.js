const express = require('express');

const http = require('http');       

const socketIo = require('socket.io'); 

const app = express();

const server = http.createServer(app);

const io = socketIo(server); 

const ejs = require('ejs');
const path = require('path');
const {Socket} = require('dgram')
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {
   res.render('index.html');
});

/*##### LOGICA DO SOCKET.IO - ENVIO PROPAGAÇÃO DE MENSAGENS */
/* ESTRUTURA DE CONEXÃO  DO SOCKET.IO*/   
let messages = [];
io.on('connection', socket => {
   console.log('Usuário conectado!' + socket.id);
   //Recupera e mantem as mensagens entre o front e o back
   socket.emit('previousMessages', messages);
   //LOGICA DE ENVIO DE MENSAGENS
   socket.on('sendMessage', data => {
    
      messages.push(data); // Adiciona a mensagem no array de mensagens
      socket.broadcast.emit('receivedMessage', data); // Envia a mensagem para todos os outros usuários conectados
      console.log('QTD DE MENSAGENS ENVIADAS: ' + messages.length);
   })
  
});
server.listen(3000, () => {
   console.log('CHAT RODANDO EM - http://localhost:3000');
}); 