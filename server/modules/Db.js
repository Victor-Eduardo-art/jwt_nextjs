const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/JWTNodejs').then((res) => {
  console.log(`sucesso ao se conectar ao mongoDB`)
}).catch((error) => console.log(`Erro ao se conectar ao mongoDB... ${error}`))

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
})

module.exports = {
    Db: mongoose,
    User: User
}