const mongoose = require('mongoose')

const BeneficiarySchema = mongoose.Schema({
    beneficiaryName:{ type: String, required: true },
    accountNoBeneficiary:{ type: String, required: true},
    ifscCode:{ type: String, required: true },
    userId:{ type: String, required: true }
})

const BeneficiaryModel = mongoose.model('BeneficiaryDetails',BeneficiarySchema)

module.exports = BeneficiaryModel