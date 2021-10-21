const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise')
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config( {path: '../.env'} );

const port = process.env.port
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.use(async function(req, res, next) {
    try {
        req.db = await pool.getConnection();
        req.db.connection.config.namedPlaceholders = true;
        
        await req.db.query(`SET SESSION sql_mode = "TRADITIONAL"`);
        await req.db.query(`SET time_zone = '-8:00'`);

        await next();

        req.db.release();
    } catch (error) {
        console.log(error);

        if (req.db) req.db.release();
        throw error;
    }
})
app.use(cors());
app.use(express.json());


app.get('/contacts', authToken, async function (req, res) {
    try {
        const user = req.user
        const userID = req.user.userID;
        const [rows] = await req.db.query(`SELECT * FROM contacts WHERE userID = :userID`, { userID });
        res.json(rows);
        // return user;
    } catch (error) {
        res.json(error)
    }
})

app.put('/contacts/:FirstName/:LastName', authToken, async function (req, res) {
    try {
        const { FirstName, LastName } = req.params;
        const newFirst = req.body.FirstName;
        const newLast = req.body.LastName;
        const userID = req.user.userID
        await req.db.query(`
            UPDATE contacts
            SET FirstName = :newFirst,
            LastName = :newLast
            WHERE FirstName = :FirstName
            AND LastName = :LastName
            AND userID = :userID
            `, 
            {newFirst, newLast, FirstName, LastName, userID})
        console.log(req)
        res.json('success')
    } catch(error) {
        console.log(error);
    }
})

app.post('/contacts', authToken, async function (req, res) {
    try {
        const body = req.body
        const firstName = body.FirstName
        const lastName = body.LastName
        const userID = req.user.userID
        console.log(req)
        const [SQL] = await req.db.query  (`INSERT INTO contacts (FirstName, LastName, userID)
        VALUES (
            '${firstName}', 
            '${lastName}',
            '${userID}'
            )`)
        // console.log(body)
        const [lastAddedContact] = await req.db.query(`select * from contacts WHERE FirstName = last_insert_id();`)
        res.json(lastAddedContact)

        // if (firstName === 'undefined' && lastName === 'undefined' ) {
        //     return res.status(400).json({error: 'First and Last name must be defined'});
        // } 
        // return res.status(200).json(body);
    }catch(err) {
        console.log(req.user) 
        res.status(500).json({error: err, message: err.message})
    }
})

app.post('/signup', async (req, res) => {
    try{
        const encryptedPass = await bcrypt.hash(req.body.userPassword, 10);
        const userName = req.body.userName;
        const [row] = await req.db.query
        ('SELECT * FROM users WHERE userName = :userName', {userName})

        if(row.length === 0) {
            await req.db.query
            ('INSERT INTO users (userName, userPassword) VALUES (:userName, :encryptedPass)',
            {userName, encryptedPass} )
            res.json("User added.");
        } else {
            res.json("Username is unavailable.")
        }
    }catch (error) {
        res.json(error);
    }
})

app.post('/login', async (req, res) => {
    try{
        const userName = req.body.userName;
        const userPassword = req.body.userPassword;
        const [userQuery] = await req.db.query(`SELECT * FROM users WHERE userName = :userName`, { userName })
        if(userQuery.length===0 ) {
            res.json({accessToken: 'usernameNotFound'})
        } else {
            if ( await bcrypt.compare(userPassword, userQuery[0].userPassword) === true) {
                const user = {
                    userID: userQuery[0].userID,
                    userName: userQuery[0].userName,
                    userPassword: userQuery[0].userPassword }
                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
                    res.json({accessToken: token});
            } else {
                res.json({accessToken: 'passwordInvalid'})
            }
        }
    } catch (error) {
        res.json(error)
    }
})

app.delete('/contacts/:FirstName/:LastName', authToken, async function(req, res)  {
    try { 
        const { FirstName, LastName } = req.params
        const userID = req.user.userID
        
        await req.db.query(`
            DELETE 
            FROM contacts 
            WHERE FirstName = :FirstName
            AND userID = :userID`, 
            {FirstName, LastName, userID} 
        )

        res.json("success")
    } catch(err) {
        console.log('no')
        console.log(err);
    }
})

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) {
        res.json("token not provided, access denied")
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if( error) {
                res.json("token verification error")
            } else {
                req.user = user;
                next();
            }
        })
    }
}








app.listen(port, () => console.log("LISTENING ON PORT " + port))