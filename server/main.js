const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv').config()
const routers = require('./modules/Router')

app.use(express.json())
app.use(cors())
app.use('/', routers)

app.listen('8080', () => console.log(` server rodando em localhost:8080`))