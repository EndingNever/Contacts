const express = require('express');
const cors = require('cors');
const {getDatabaseConnection} = require('./util');

const app = express();
app.use(getDatabaseConnection);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: /http:\/\/localhost/ }));
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

app.get('/contacts', async (req, res) => {
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
        LastName = '${lastName}',
        number = '${number}',
        email = '${email}',
        address = '${address}',
        city = '${city}',
        state = '${state}' 
        WHERE FirstName = '${person}'`

        const [update] = await req.db.query(SQL)
        
    console.log(res.json(update));  
    // return res.status(200).json(update)
    } catch (err) {
        return res.status(500).json({error:err, reason: err.message})
    }
})


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`LISTENING!! (${PORT})`);
})