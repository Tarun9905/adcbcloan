const mongoose = require('mongoose')

const RegisterSchema = mongoose.Schema({
    userName:{ type: String, required: true },
    userId:{ type: String, required: true, unique: true},
    password:{ type: String, required: true },
    accountNo:{ type: String, required: true },
})

const RegisterModel = mongoose.model('Registration',RegisterSchema)

module.exports = RegisterModel