// quiero 6 mazos, osea 208 cartas, y quiero que el as tenga valor 1 y que el numero sea A (string), y que el palo sea hearts, diamonds, clubs y spades respectivamente (string)
const mongoose = require('mongoose');
require('./database');
const Carta = require('./models/Carta');

const createCards = async () => {
    const palos = ['hearts', 'diamonds', 'clubs', 'spades'];
    const figuras = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let cartas = [];
    for (let i = 0; i < 6; i++) {
        for (let palo of palos) {
            for (let numero = 1; numero <= 13; numero++) {
                let figura = figuras[numero - 1];
                let carta = new Carta({
                    numero,
                    palo,
                    figura
                });
                cartas.push(carta);
            }
        }
    }
    await Carta.insertMany(cartas);
}

createCards();

