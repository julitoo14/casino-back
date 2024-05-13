const { Schema, model} = require('mongoose');
const Carta = require('./Carta');

const PartidaSchema = Schema({
    jugador: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    mazo: [Carta.schema],
    manoJugador: [Carta.schema],
    manoJugador2: [Carta.schema],
    manoCroupier: [Carta.schema],
    apuesta: Number,
    resultado: {
        type: String,
        default: 'En juego'
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    puntajeJugador: Number,
    puntajeJugador2: Number,
    puntajeCroupier: Number
});

module.exports = model('Partida', PartidaSchema, 'partidas');