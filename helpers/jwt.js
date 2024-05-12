const jwt = require('jwt-simple');
const moment = require('moment');

//clave
const secret = 'SECRETAA';
//crear funcion para generar tokens
const createToken = (user) => {
    const payload = {
        userName: user.userName,
        userId: user.userId,
        iat: moment().unix(),
        exp: moment().add(1440 , "minutes")
    };

    return jwt.encode(payload, secret);
}
//exportar modulos
module.exports = {secret, createToken};