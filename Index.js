const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const RegisterModel = require('./Models/RegisterModel');
const FundsTransferModel = require('./Models/FundsTransferModel');
const BeneficiaryModel = require('./Models/BeneficiaryModel');




const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3500;

mongoose.connect('mongodb+srv://tarunrekandar992005_db_user:l0a5XlD1poYiLOqC@bankadcb.bo7yetb.mongodb.net/?appName=BankADCB')
  .then(() => console.log('mongoose connected successfully'))
  .catch((err) => console.log(err))

app.listen(port, () => {
  console.log(`Server running successfully in ${port} port`)
});


// Registartion
// app.post('/userRegister', async (req, res) => {
//     try {
//         const { userName, userId, password } = req.body;

//         // basic validation
//         if (!userName || !userId || !password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // check if user already exists
//         const existingUser = await RegisterModel.findOne({ userId });
//         if (existingUser) {
//             return res.status(409).json({ message: 'User already exists' });
//         }

//         // save user
//         const newUser = new RegisterModel({
//             userName,
//             userId,
//             password // ⚠️ should be hashed in real apps
//         });

//         await newUser.save();

//         res.status(201).json({ message: 'User registered successfully' });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// POST - User Registration
app.post('/userRegister', async (req, res) => {
  try {
    const { userName, userId, password, accountNo } = req.body;

    // 1. Validate
    if (!userName || !userId || !password || !accountNo) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check existing user
    const existingUser = await RegisterModel.findOne({ userId });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // 3. Check duplicate account number
    const existingAccount = await RegisterModel.findOne({ accountNo });
    if (existingAccount) {
      return res.status(409).json({ message: 'Account number already in use' });
    }

    // 4. Create user
    const newUser = new RegisterModel({
      userName,
      userId,
      password, // ⚠️ hash later with bcrypt
      accountNo
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userName,
        userId,
        accountNo
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Login 
// app.post('/userLogin', async (req, res) => {
//     try {
//         const { userId, password } = req.body;

//         if (!userId || !password) {
//             return res.status(400).json({ message: 'UserId and Password required' });
//         }

//         const user = await RegisterModel.findOne({ userId });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         if (user.password !== password) {
//             return res.status(401).json({ message: 'Invalid password' });
//         }

//         res.status(200).json({
//             message: 'Login successful',
//             userName: user.userName,
//             userId: user.userId
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
app.post('/userLogin', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    const user = await RegisterModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If userId exists → login success
    res.status(200).json({
      message: 'Login successful',
      userName: user.userName,
      userId: user.userId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//get User Details
app.get('/getUserDetails/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // find user
    const user = await RegisterModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userName: user.userName,
      userId: user.userId,
      accountNo: user.accountNo
      // do NOT send password in real apps
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//Funds Transfer
// app.post('/fundsTransfer', async (req, res) => {
//     try {
//         const { userId, from, beneficiary, amount, purpose, type } = req.body;

//         // Basic validation
//         if (!userId || !from || !beneficiary || !amount || !purpose || !type) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Create a new transfer record
//         const transfer = new FundsTransferModel({
//             userId,
//             from,
//             beneficiary,
//             amount,
//             purpose,
//             type
//         });

//         const savedTransfer = await transfer.save();

//         res.status(201).json({
//             message: 'Funds transfer successful',
//             transfer: savedTransfer
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

app.post('/fundsTransfer', async (req, res) => {
  try {
    const {
      accountNo,
      from,
      beneficiaryName,
      accountNoBeneficiary,
      ifscCode,
      amount,
      purpose,
      type
    } = req.body;

    // 1. Validate
    if (
      !accountNo ||
      !from ||
      !beneficiaryName ||
      !accountNoBeneficiary ||
      !ifscCode ||
      !amount ||
      !purpose ||
      !type
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Create transfer
    const transfer = new FundsTransferModel({
      accountNo,
      from,
      beneficiaryName,
      accountNoBeneficiary,
      ifscCode,
      amount,
      purpose,
      type
    });

    const savedTransfer = await transfer.save();

    res.status(201).json({
      message: 'Funds transfer successful',
      transfer: savedTransfer
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Tansactions
app.get('/getTransaction/:accountNo', async (req, res) => {
  try {
    const { accountNo } = req.params;

    if (!accountNo) {
      return res.status(400).json({ message: 'Account number is required' });
    }

    // Find transactions for this account
    const transactions = await FundsTransferModel
      .find({ accountNo })
      .sort({ createdAt: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this account' });
    }

    res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//post Beneficiary
app.post('/addBeneficiary/details', async (req, res) => {
  try {
    const { beneficiaryName, accountNoBeneficiary, ifscCode, userId } = req.body;

    // 1. Validate
    if (!beneficiaryName || !accountNoBeneficiary || !ifscCode || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 3. Save
    const newBeneficiary = new BeneficiaryModel({
      beneficiaryName,
      accountNoBeneficiary,
      ifscCode,
      userId
    });

    await newBeneficiary.save();

    res.status(201).json({
      message: 'Beneficiary added successfully',
      beneficiary: newBeneficiary
    });

  } catch (error) {
    console.log(error); // to see real error

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This beneficiary account already exists for this user'
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

//get all Beneficiaries
app.get('/getAllBeneficiaries', async (req, res) => {
  try {
    const beneficiaries = await BeneficiaryModel.find().sort({ beneficiaryName: 1 });

    if (!beneficiaries || beneficiaries.length === 0) {
      return res.status(404).json({ message: 'No beneficiaries found' });
    }

    res.status(200).json({
      message: 'Beneficiaries fetched successfully',
      beneficiaries
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// get Beneficiary by ID
app.get('/getBeneficiary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const beneficiary = await BeneficiaryModel.find({ userId })

    if (!beneficiary || beneficiary.length === 0) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    res.status(200).json({
      message: 'Beneficiary fetched successfully',
      beneficiary
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Invalid ID or server error' });
  }
});
