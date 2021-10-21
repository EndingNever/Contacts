const express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const { getDatabaseConnection } = require('../util');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const { req, res } = require('express');

const app = express();
app.use(getDatabaseConnection);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: /http:\/\/localhost/ }));
app.use(helmet());
app.options('*', cors());

require ('dotenv').config( {path: '../.env'} );

const mysql = require('mysql2/promise');


const pool = mysql.createPool({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const databaseConnection = async (req, res, next) => {
    try {
    req.db = await pool.getConnection();
    req.db.connection.config.namedPlaceholders = true;

    await req.db.query(`SET SESSION sql_mode = "TRADITIONAL"`);
    await req.db.query(`SET time_zone = '-8:00'`);

    await next();

    req.db.release();
    } catch (err) {
    console.log(err);

    if (req.db) req.db.release();
    throw err;
    }   
}

const createUser = async (connection, username, password) => {
    // enable mysql2 named placeholders syntax
    connection.config.namedPlaceholders = true;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      let now = new Date(); // get current date time
      //adjust for timezone
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //convert to timestamp format
      now = now.toISOString().slice(0, 19).replace("T", " ");
  
      const [results] = await connection.query(
        `INSERT INTO user (username, password, created_date, updated_date) 
          VALUES (:username, :hashedPassword, :now, :now)`,
        { username, hashedPassword, now }
      );
  
      return results.insertId;
    } catch (err) {
      console.error(err);
    }
  };



const createTokens = (payload) => {
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60m",
    });
    const refresh_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60m"
    })
    return [token, refresh_token]
};

const login = async (req, res) => {
    const { userName, userPassword } = req.body;

    try {
        if (!username || !password)
            throw new Error("no username or password provided");

        const [results] = await req.db.query(
            "SELECT * FROM users WHERE userName = :userName",
            { userName }
        );

        if (results.length === 0)
            throw new Error("username or password are invalid");

        const user = results[0];

        const passwordMatching = await bcrypt.compare(password, user.password);
        if (!passwordMatching) throw new Error("username or password are invalid")

        const [token, refresh_token] = createTokens({ id: user.userID });
        user.password = undefined;
        res.send({ user, token, refresh_token });
    } catch (err){
        console.error(err);
        res.send({ error: err.message })
    }
    req.db.release();
}

const register = async (req, res) => {
    const { userName, userPassword } = req.body;

    try {
        if(!username || !password) 
            throw new Error("no username or password given")
        const insertedId = await createUser(req.db, userName, userPassword)
        if(!insertedId) throw new Error("Username already exists");

        const [token, refresh_token] = createTokens({ id: insertedID });
        res.status(201).send({ id: insertedId, token, refresh_token });
    } catch(err){
        console.error(err);
        res.send({ error: err.message })
    }
    req.db.release();
}


const verify = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '');

    try {
        if(!token) return res.status(400).send({ error: 'token not provided'} );

        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.userId = payload.id;
        next();

    } catch(err) {
        console.error(err);
        res.send({ error: err.message })
    }
}

const auth = express.Router();

auth.use(express.json());
auth.use(express.urlencoded({ extended: true }));

auth.use(require(databaseConnection))

auth.post('/login', login);
auth.post('/register', register);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`LISTENING!! (${PORT})`);
})