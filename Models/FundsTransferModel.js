const mongoose = require('mongoose');

const FundsTranferSchema = mongoose.Schema({
    accountNo:{ type: String, required: true },
    from:{ type: String, required: true },
    beneficiaryName:{ type: String, required: true },
    accountNoBeneficiary:{ type: String, required: true },
    ifscCode:{ type: String, required: true },
    amount: { type: Number, required: true },
    purpose:{type: String,required:true},
    type:{type: String,required:true}
}, { timestamps: true });

const FundsTranferModel = mongoose.model('FundsTranfer',FundsTranferSchema);

module.exports = FundsTranferModel