const express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const {getDatabaseConnection} = require('./util');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const { request, response } = require('express');

const app = express();
app.use(getDatabaseConnection);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: /http:\/\/localhost/ }));
app.use(helmet());
app.options('*', cors());

require('dotenv').config();



app.get('/', async (req, res) => {
    try {
        // const SQL = 'SELECT * FROM contacts'
        // const [contacts] = await req.db.query(SQL);

        
        res.status(200).json("Make sure you have /contacts !!!");
    } catch (err) {
        console.log(await req.db.query(`SELECT * FROM contacts`));
        res.status(500).json({error:err, reason: err.message});
    }
});

app.get('/contacts', authToken, async (req, res) => {
    try {
        const SQL = 'SELECT * FROM contacts'
        const [contacts] = await req.db.query(SQL);

        // console.log(contacts)
        res.status(200).json(contacts);
    } catch (err) {
        // console.log(await req.db.query(`SELECT * FROM contacts`));
        res.status(500).json({error:err, reason: err.message});
    }
});



app.get('/contacts/:FirstName', async (req, res) => {
    try {
        const firstName = req.params.FirstName
        const SQL = `SELECT * FROM contacts WHERE FirstName LIKE '%%${firstName}%%'`
        const [name] = await req.db.query(SQL,{FirstName:firstName});

        console.log(SQL);
        return res.status(200).json(name); 
    } catch(err) {
        res.status(500).json({error:err, reason:err.message})
    }
});

app.post('/contacts', async (req, res) => {
    try {
        const body = req.body
        const firstName = body.FirstName
        const lastName = body.LastName
        const number = body.number
        const email = body.email
        const address = body.address
        const city = body.city
        const state = body.state

        const SQL = `INSERT INTO contacts (FirstName, LastName, number, email, address, city, state)
        VALUES (
            '${firstName}',
            '${lastName}', 
            '${number}', 
            '${email}',
            '${address}',  
            '${city}', 
            '${state}')`
        const [contacts] = await req.db.query(SQL);
        
        if (firstName === 'undefined' && lastName === 'undefined' ) {
            return res.status(400).json({error: 'First and Last name must be defined'});
        } 
        return res.status(200).json(body);
    }catch(err) {
        res.status(500).json({error: err, message: err.message})
    }
})

app.patch("/contacts/:person", async (req, res) => {
    try {
        const body = req.body
        const person = req.params.person
        const id = body.id
        const firstName = body.FirstName
        const lastName = body.LastName
        const number = body.number
        const email = body.email
        const address = body.address
        const city = body.city
        const state = body.state

        const [getId] = await req.db.query(`SELECT id FROM CONTACTS WHERE FirstName = '${req.body.FirstName}'`)
        
        const SQL = `UPDATE contacts 
        SET FirstName = '${firstName}',
        LastName = '${lastName}'
        WHERE FirstName = '${person}'`

        const [update] = await req.db.query(SQL)
        
    console.log(res.json(update));  
    return res.status(200).json(update)
    } catch (err) {
        return res.status(500).json({error:err, reason: err.message})
    }
})

//* USER LOGIN ***
// Sign up User
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

// Login user & verify username / password
app.post('/login', async (req, res) => {
    try {
        const userName = req.body.userName;
        const password = req.body.userPassword;
        const [userQuery] = await req.db.query('SELECT * FROM users WHERE userName = :userName', {userName})

        if(userQuery.length === 0 ) {
            res.json({accessToken: 'usernameNotFound'})
        } else { 
            if( await bcrypt.compare(password, userQuery[0].userPassword)===true) {
                const user = {userId: userQuery[0].userId,
                    userName: userQuery[0].userName,
                    userPassword: userQuery[0].userPassword }

                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
                    console.log('password confirmed')
                    res.json({accessToken: token});
            } else {
                console.log('DENIED')
                res.json({accessToken: 'passwordInvalid'})
            }
        }
    }catch(error) {
        res.json(error)
    }
})
//* END User Login***


function authToken(req, res, next) {
    const authHeader = req.headers['auth'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) {
        res.json("Token not given, access denied.")
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if(error) {
                res.json("Token verification error, access denied")
            } else {
                req.user = user
                next()
            }
        })
    }
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`LISTENING!! (${PORT})`);
})