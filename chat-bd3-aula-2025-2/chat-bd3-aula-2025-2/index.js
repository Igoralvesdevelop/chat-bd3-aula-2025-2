const express = require('express');

const http = require('http');       

const socketIo = require('socket.io'); 

const app = express();

const server = http.createServer(app);

const io = socketIo(server); 
const mongoose = require('mongoose'); // Importando o mongoose
const ejs = require('ejs');
const path = require('path');
const {Socket} = require('dgram');
const { error } = require('console');
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {
   res.render('index.html');
});

// Conexão com o banco de dados MongoDB
function connectToDatabase() {
  
      let dbUrl = 'mongodb+srv://IgorAlves:Ix1cwvB5lTXYeARG@cluster0.im0mg.mongodb.net/'
      mongoose.connect(dbUrl);
      
      mongoose.connection.on('error', console.error.bind(console, 'Erro de conexão:'));

      mongoose.connection.once('open', function() {
         console.log('Conectado ao MongoDB!');
      });
}

connectToDatabase(); // Chama a função para conectar ao banco de dados
let Message = mongoose.model('Message',{
   usuario: String,
   data_hora: String,
   message: String
})
/*##### LOGICA DO SOCKET.IO - ENVIO PROPAGAÇÃO DE MENSAGENS */
/* ESTRUTURA DE CONEXÃO  DO SOCKET.IO*/   
let messages = [];
Message.find({})
   .then(docs => {
      messages = docs
   }).catch(error => {
      console.log(error);
   }
   );

io.on('connection', socket => {
   console.log('Usuário conectado!' + socket.id);
   //Recupera e mantem as mensagens entre o front e o back
   socket.emit('previousMessages', messages);
   //LOGICA DE ENVIO DE MENSAGENS
   socket.on('sendMessage', data => {
    
      // messages.push(data); // Adiciona a mensagem no array de mensagens

      let message = new Message(data); // Cria uma nova instância do modelo Message
      message.save() // Salva a mensagem no banco de dados
         .then( 
             socket.broadcast.emit('receivedMessage', data)
         )
         .catch(error => {
            console.error(error);
         });
      socket.broadcast.emit('receivedMessage', data); // Envia a mensagem para todos os outros usuários conectados
      console.log('QTD DE MENSAGENS ENVIADAS: ' + messages.length);
   })
  
});
server.listen(3000, () => {
   console.log('CHAT RODANDO EM - http://localhost:3000');
}); 