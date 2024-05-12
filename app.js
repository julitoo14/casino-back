const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./database');

const partidaRoutes = require('./routes/partida.routes');
const userRoutes = require('./routes/user.routes');


app.use(bodyParser.json());
app.use('/api', partidaRoutes);
app.use('/auth', userRoutes);


const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

exports.app = app;
