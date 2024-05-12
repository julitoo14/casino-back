const Partida = require('../models/Partida');
const User = require('../models/User');
const Carta = require('../models/Carta');

const mezclarMazo = (mazo) => {
    mazo = mazo.sort(() => Math.random() - 0.5);
    return mazo;
}

const repartirCartaJugador = (partida) => {
    return partida.manoJugador.push(partida.mazo.pop());
}

function repartirCartaCroupier(partida) {
    return partida.manoCroupier.push(partida.mazo.pop());
}

const calcularManoJugador = (partida) => {
    let valor = 0;
    let ases = 0; // Contador para los Ases
    for (let carta of partida.manoJugador) {
        if (carta.numero > 10) {
            valor += 10;
        } else if (carta.numero === 1) {
            valor += 11; // Por defecto, el As vale 11
            ases++; // Incrementar el contador de Ases
        } else {
            valor += carta.numero;
        }
    }
    // Si el valor total de la mano supera 21 y hay Ases, ajustar el valor del As a 1
    while (valor > 21 && ases > 0) {
        valor -= 10; // Restar 10 para ajustar el valor del As de 11 a 1
        ases--; // Decrementar el contador de Ases
    }
    return valor;
}

const calcularManoCroupier = (partida) => {
    let valor = 0;
    let ases = 0; // Contador para los Ases
    for (let carta of partida.manoCroupier) {
        if (carta.numero > 10) {
            valor += 10;
        } else if (carta.numero === 1) {
            valor += 11; // Por defecto, el As vale 11
            ases++; // Incrementar el contador de Ases
        } else {
            valor += carta.numero;
        }
    }
    // Si el valor total de la mano supera 21 y hay Ases, ajustar el valor del As a 1
    while (valor > 21 && ases > 0) {
        valor -= 10; // Restar 10 para ajustar el valor del As de 11 a 1
        ases--; // Decrementar el contador de Ases
    }
    return valor;

}

const jugarManoCroupier = (partida) => {
    while (calcularManoCroupier(partida) < 17) {
        repartirCartaCroupier(partida);
    }
    if (calcularManoCroupier(partida) > 21) {
        return 'GANADA';
    } else if (calcularManoCroupier(partida) > calcularManoJugador(partida)) {
        return 'PERDIDA';
    } else if (calcularManoCroupier(partida) < calcularManoJugador(partida)) {
        return 'GANADA';
    } else {
        return 'EMPATE';
    }
}

const startGame = async (req, res) => {
    // Crear una nueva partida
    const partida = new Partida();
    const userId = req.params.userId;
    partida.jugador = userId
    partida.apuesta = 200;
    partida.mazo = await Carta.find().exec();
    partida.mazo = mezclarMazo(partida.mazo);
    repartirCartaJugador(partida);
    repartirCartaCroupier(partida);
    repartirCartaJugador(partida);
    repartirCartaCroupier(partida);

    const user = await User.findOne({_id: partida.jugador}).exec();

    if (user.saldo < partida.apuesta) {
        return res.status(400).json({message: 'No tienes suficiente saldo para esta apuesta'});
    }
    user.saldo -= partida.apuesta;
    console.log(`Saldo del jugador: ${user.saldo}, Apuesta: ${partida.apuesta}`)

    await user.save();

    console.log(calcularManoJugador(partida));
    console.log(partida._id);
    // Guardar la partida en la base de datos
    await partida.save();

    // Devolver la partida en la respuesta
    res.status(200).json(partida);
}

const hit = async (req, res) => {
    // Encontrar la partida
    const partida = await Partida.findById(req.params.id).exec();
    console.log(partida.jugador);
    const user = await User.findOne({ _id: partida.jugador }).exec();
    console.log(user);

    if(partida.resultado !== 'En juego'){
        return res.status(400).json({message: 'La partida ya ha terminado'});
    }

    // Repartir una carta al jugador
    repartirCartaJugador(partida);
    console.log(calcularManoJugador(partida));
    if(calcularManoJugador(partida) > 21){
        partida.resultado = 'PERDIDA';
    }
    // Guardar la partida
    await partida.save();
    // Devolver la partida en la respuesta
    return res.status(200).json(partida);
}

const stand = async (req, res) => {
    // Encontrar la partida
    const partida = await Partida.findById(req.params.id).exec();
    const user = await User.findOne({ _id: partida.jugador }).exec();
    if(partida.resultado !== 'En juego') {
        return res.status(400).json({message: 'La partida ya ha terminado'});
    }
    // Calcular la mano del croupier
    const resultado = jugarManoCroupier(partida);
    if(resultado === 'GANADA'){
        user.saldo += partida.apuesta * 2;
        partida.resultado = 'GANADA';

    } else if(resultado === 'EMPATE'){
        user.saldo += partida.apuesta;
        partida.resultado = 'EMPATE';
    } else {
        partida.resultado = 'PERDIDA';
    }
    console.log(user.saldo)
    await user.save();
    await partida.save();
    res.status(200).json(partida.resultado, calcularManoJugador(partida), calcularManoCroupier(partida));


}

exports.startGame = startGame;
exports.hit = hit;
exports.stand = stand;