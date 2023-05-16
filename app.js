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
    const pass = req.body.typePassX
    let passhash = await bcryptjs.hash(pass, 8)
    connection.query(`INSERT INTO users (user, name, rol, pass) VALUES ('${user}','${name}','Estudiante','${passhash}')` , async(err, result)=>{
    if(err){
            console.log(err)
        }
        else{
            res.render('login.ejs')
        }
    })
})

app.post('/login',async (req, res)=>{
    const user = req.body.EmailX
    const pass = req.body.PasswordX
    var contraseña = false
    var rol = " "
    connection.query(`SELECT  pass, rol FROM users WHERE user = '${user}'`, async(err, result)=>{
    bcryptjs.compare(pass, result[0].pass, (err,resul)=>{
        if(resul){
            if(result[0].rol == "Estudiante")
            res.render('vista.estudiante.ejs')
            if(result[0].rol == "Administrador")
            res.render('vista.administrador.ejs')
            if(result[0].rol == "Profesor")
            res.render('vista.profesor.ejs')
        }else{
            res.render('login.ejs')
        }
    })
    })

})



app.listen(3000, (req, res)=>{
    console.log('Server is running on http://localhost:3000')
})

