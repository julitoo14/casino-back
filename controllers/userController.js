// dependencias
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");
const mongoose = require("mongoose");



//clean up users
const cleanUpUsers = async () => {
    await User.deleteMany({}).exec();
}

//registro
const register = async (req, res) => {
    // Recoger datos de la peticion
    let params = req.body;
    //comprobar q me llegan bien
    if (!params.userName || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "missing required parameters",
        });
    }

    try {
        //cifrar contraseña
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        //crear objeto del usuario
        let userToSave = new User(params);

        //Guardar el usuario en la bd
        let savedUser = await userToSave.save();

        if (!savedUser) {
            return res.status(500).send({
                status: "Error",
                message: "Failed to save user into database",
            });
        }

        // limpiar el objeto a devolver
        let userCreated = savedUser.toObject();
        delete userCreated.password;

        return res.status(200).send({
            message: "User " + params.nick + " has been registered successfully. You will be redirected to Home page in 5 seconds",
            status: "success",
            user: userCreated,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
}

const login = async (req, res) => {
    // recibir parametros de peticion
    const params = req.body;
    //comprobar que me llegan
    if (!params.userName || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }
    //Buscar en la bd si existe el email
    let user = await User.findOne({ userName: params.userName })
        .select("+password +role")
        .exec();

    if (!user) {
        return res.status(400).send({
            status: "error",
            message: "User isn't registered",
        });
    }

    //comprobar su contraseña
    const pwd = bcrypt.compareSync(params.password, user.password);
    if (!pwd) {
        return res.status(400).send({
            status: "error",
            message: "Wrong credentials",
        });
    }

    //limpiar objeto
    identityUser = user.toObject();
    delete identityUser.password;

    //conseguir token jwt
    const token = jwt.createToken(user);

    //Devolver datos de usuario y token
    return res.status(200).send({
        message: "User logged succesfully, Welcome " + user.userName+"!",
        status: "success",
        user: identityUser,
        token,
    });
}

const getUser = async (req, res) => {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
        return res.status(404).send({
            status: "error",
            message: "User not found",
        });
    }
    return res.status(200).send({
        status: "success",
        user,
    });
}



module.exports = {
    register,
    cleanUpUsers,
    login,
    getUser,
};