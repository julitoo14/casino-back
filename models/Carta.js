const { Schema, model} = require('mongoose');

const CartaSchema = Schema({
    numero: {
        type: Number,
        required: true
    },
    palo: {
        type: String,
        required: true
    },
    figura: {
        type: String,
        required: true
    }
});


module.exports = model('Carta', CartaSchema, 'cartas');