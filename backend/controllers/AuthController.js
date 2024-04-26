const {compare} = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

module.exports.AuthControl = async (req, res) => {
    console.log(req.body);
    const {isLogin, username, password} = req.body;
    if (isLogin) {
        req.body = {username: username, password: password};
        await module.exports.SignIn(req, res);
    } else {
        req.body = {username: username, password: password};
        await module.exports.SignUp(req, res);
    }
}

module.exports.SignUp = async (req, res) => {
    try {
        const {username, password} = req.body;

        // Prepared Statements: Check if the user input is valid
        if (username == null || password == null) {
            return res.status(400).json({message: "Empty Fields."});
        }

        // Prepared Statements: Check if the username does not have space
        if (username.includes(' ')) {
            return res.status(400).json({message: "Username cannot include space."});
        }

        // Searching user by the username can be speed up by utilizing the index on username
        const userExists = await User.findOne({
            $or: [{username: username.toLowerCase()}]
        });

        if (userExists != null) {
            let errorMessage = "Username already exists.";
            return res.status(409).json({message: errorMessage});
        }

        const newUser = await User.create({ //Create new user in the MongoDb
            username: username.toLowerCase(),
            password: password,
            RegistrationDate: new Date(),
        });

        const token = jwt.sign({ userId: newUser._id }, 'CS348', { expiresIn: '1h' });
        return res.status(200).json({ //User Created.
            isAuthenticated: true,
            userID: newUser._id.toString(),
            token: token,
        });
    } catch (error) {
        console.log("SignUp module: " + error);
        res.status(500).json({message: "Something went wrong..."});
    }
}

module.exports.SignIn = async (req, res) => {
    try {
        const {username, password} = req.body;

        // Prepared Statements: Check if the user input is valid
        if (username === null || password === null || username === '' || password === '') {
            //Check for null fields or empty fields.
            return res.status(400).json({message: "Empty fields."});
        }

        // Prepared Statements: Check if the username does not have space
        if (username.includes(' ')) {
            return res.status(400).json({message: "Username cannot include space."});
        }

        // Searching user by the username can be speed up by utilizing the index on username
        const findUser = await User.findOne({
            $or: [{username: username.toLowerCase()}]
        }); //Find username in the database

        if (findUser === null) { //User does not exist.
            return res.status(401).json({message: "Username Not Found"});
        }

        // Compares password given by client and decrypted password stored in MongoDB
        const verifyPassword = await compare(password, findUser.password);

        if (!verifyPassword) {
            return res.status(401).json({message: "Invalid credentials."});
        }

        console.log("yeeeee");
        //Return object to client
        const token = jwt.sign({ userId: findUser._id }, 'CS348', { expiresIn: '1h' });
        return res.status(200).json({
            isAuthenticated: true,
            userID: findUser._id.toString(),
            token: token,
        });

    } catch (error) {
        console.log("SignIn module: " + error);
        return res.status(500).json({message: "Something went wrong..."});
    }
}