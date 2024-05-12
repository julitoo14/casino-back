const { Schema, model} = require('mongoose');

const CartaSchema = Schema({
    numero: {
        type: Number,
        required: true
    },
    palo: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true
    }
});


module.exports = model('Carta', CartaSchema, 'cartas');