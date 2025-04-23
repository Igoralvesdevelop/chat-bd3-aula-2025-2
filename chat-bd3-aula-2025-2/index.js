const express = require('express');

const http = require('http');       

const app = express();

const server = http.createServer(app);

const ejs = require('ejs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));0,


app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {
   res.render('index.html');
});
server.listen(3000, () => {
   console.log('CHAT RODANDO EM - http://localhost:3000');
}); 