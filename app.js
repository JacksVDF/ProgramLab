const express = require('express')
const app = express()


app.use(express.urlencoded({extended:false}))
app.use(express.json())

const dotenv = require('dotenv')
dotenv.config({path:'./env/.env'})

app.use('/resources', express.static('public'))
app.use('/resources', express.static(__dirname + '/public'))

app.set('view engine', 'ejs')

const bcryptjs = require('bcryptjs')
const session = require('express-session')

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

const connection = require('./database/db')
const e = require('express')

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/register', async (req, res)=>{
    const user = req.body.typeNameX
    const name = req.body.typeEmailX
    const pass = req.body.typeRePassX
    let passhash = await bcryptjs.hash(pass, 8)
    connection.query('INSERT INTO users SET ?', {user:user, name:name, rol:'Estudiante', pass:passhash}, async(err, result)=>{
        if(error){
            console.log(error)
        }
        else{
            res.send('Registro realizado')
        }
    })
})

app.listen(3000, (req, res)=>{
    console.log('Server is running on http://localhost:3000')
})

