const mongoose = require('mongoose')

const BeneficiarySchema = mongoose.Schema({
    beneficiaryName:{ type: String, required: true },
    accountNoBeneficiary:{ type: String, required: true, unique: true},
    ifscCode:{ type: String, required: true },
    userId:{ type: String, required: true }
})

const BeneficiaryModel = mongoose.model('Beneficiary',BeneficiarySchema)

module.exports = BeneficiaryModel