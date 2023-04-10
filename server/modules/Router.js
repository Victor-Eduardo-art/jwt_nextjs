const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Db, User} = require('./Db')

Router.get('/', (req, res) => {
    res.status(200).json({msg: 'opa bora tomar cafe'})
})

Router.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({error: 'você não tem autorização para acessar essa página...'})
    }

    return res.status(200).json({user: user})
})

function checkToken (req, res, next) {

    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({error: "acesso não autorizado para essa página"})
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    } catch (error) {
        console.log(`Erro inesperado: ${error}`)

        return res.status(500).json({error: 'Token inválido'})
    }  
}

Router.get('/users/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)

    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({error: 'você não tem autorização para acessar essa página...'})
    }

})

Router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body

    console.log(name)
    console.log(email)
    console.log(password)

    if (!name) {
        return res.status(422).json({error: 'nome vazio'})
    } 
    
    if (!email) {
        return res.status(422).json({error: 'email vazio'})
    } 
    
    if (!password) {
        return res.status(422).json({error: 'senha vazia'})
    }

    const userExisted = await User.findOne({email: email})

    if (userExisted) {
        return res.status(422).json({error: "Usuário já cadastrado... Por favor use outro email"})
    }


    const salt = await bcrypt.genSalt(15)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email, 
        password: passwordHash
    })

    try {
        user.save()
        return res.status(201).json({msg: 'sucesso ao criar seu Usuário'})

    } catch (error) {
        console.log(`Erro inesperado: ${error}`)

        return res.status(500).json({error: 'Aconteceu um erro no servidor, por favor tente novamente mais tarde'})
    }  
})

Router.post('/signin', async (req, res) => {
    const {email, password} = req.body
    console.log(`${email} _ ${password}`)

    if (!email) {
        return res.status(422).json({error: 'email vazio'})
    } 
    
    if (!password) {
        return res.status(422).json({error: 'senha vazia'})
    } 

    const user = await User.findOne({email: email})

    console.log(user)

    if (!user) {
        return res.status(404).json({error: 'Usuário não encontrado'})
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({error: 'Senha inválida!'})
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({id: user._id}, secret)
        
        return res.status(200).json({msg: "sucesso no login", user: {...user}._doc, token: token})
    } catch (error) {
        console.log(`Erro inesperado: ${error}`)

        return res.status(500).json({error: 'Aconteceu um erro no servidor, por favor tente novamente mais tarde'})
    }



})

module.exports = Router