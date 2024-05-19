require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/account');

// Login an account
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(204).json({ message: 'Conta não encontrada!' });
    }

    const passwordMatch = await bcrypt.compare(password, account.password);

    if (passwordMatch) {
      const jwtSecret = process.env.JWT_SECRET;

      const token = jwt.sign({ id: account._id, email: account.email }, jwtSecret, {
        expiresIn: '30d',
      });

      res.status(200).json({
        token,
        accID: account._id,
      });
    } else {
      res.status(401).json({ message: 'O dados de início de sessão estão incorretos!' });
    }
  } catch (error) {
    console.error('Account Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all accounts
const getAll = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    console.error('Get All Accounts Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get account by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ message: 'Conta não encontrada!' });
    }

    res.status(200).json(account);
  } catch (error) {
    console.error('Get Account By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new account
const create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, nif } = req.body;
    let accountExists = false;

    // Check if all fields are filled
    if (!firstName) return res.status(406).json({ message: 'The first name field is mandatory' });

    if (!lastName) return res.status(406).json({ message: 'The last name field is mandatory' });

    if (!email) return res.status(406).json({ message: 'The email field is mandatory' });

    if (!password) return res.status(406).json({ message: 'The password field is mandatory' });

    if (!phone) return res.status(406).json({ message: 'The phone field is mandatory' });

    if (!nif) return res.status(406).json({ message: 'The nif  field is mandatory' });

    // if any of the fields don't have the same name as the variable return an error
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.nif
    ) {
      return res.status(406).json({ message: 'Invalid field name' });
    }

    // Check if account already exists
    accountExists = await Account.findOne({ email });
    if (accountExists) {
      return res.status(409).json({ message: 'O email já se encontra registado!' });
    }

    accountExists = await Account.findOne({ nif });
    if (accountExists) {
      return res.status(409).json({ message: 'O NIF já se encontra registado!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Body of account
    const account = new Account({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      nif,
      role: 'user',
    });

    await account.save();
    console.log('Account created with success!\nAccount Id:', account._id);

    res.status(201).json({ message: 'Conta registada com sucesso!' });
  } catch (error) {
    console.error('Account Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send a reset password email
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(404).json({ message: 'Conta não encontrada!' });
    }

    // Generate a unique token for resetting the password (you can use any method here)
    const resetToken = generateResetToken();

    // Update the account with the reset token and expiry date
    account.resetPasswordToken = resetToken;
    // Token expiry time: 10 minutes
    account.resetPasswordExpires = Date.now() + 600000;

    // Save the updated account
    await account.save();

    // Send the reset password email
    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Reset Password Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to generate a random token (You can replace this with any token generation method you prefer)
function generateResetToken() {
  return Math.random().toString(36).slice(2);
}

// Function to send the reset password email
async function sendResetPasswordEmail(email, resetToken) {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Loja Online | Redefinir palavra-passe',
    text: `Para redefinir a sua palavra-passe, clique no seguinte link: ${process.env.WEBSITE_LINK}/reset-password/${resetToken}
    \nO link acima é válido por apenas 10 minutos.
    \nSe não pediu para redefinir a sua palavra-passe, por favor ignore este email.
    \nObrigado, \nA equipa Loja Online`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

// Verify token
const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    const account = await Account.findOne({ resetPasswordToken: token });
    if (!account) {
      return res.status(404).json({ message: 'Conta não encontrada!' });
    }
    // Check if the token is expired (10 minutes)
    const dateNow = new Date();
    const dateNowMilliseconds = dateNow.getTime();

    const resetPasswordExpiresMilliseconds = account.resetPasswordExpires.getTime();

    if (resetPasswordExpiresMilliseconds < dateNowMilliseconds) {
      // If the token is expired, remove the token and expiry date from the account
      return res.status(403).json({ message: 'Token expirado' });
    }

    return res.status(200).json({ message: 'Token válido' });
  } catch (error) {
    console.error('Verify Token Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a account password with token
const updatePasswordToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log('token', token);
    console.log('password', password);

    let account = await Account.findOne({ resetPasswordToken: token });
    if (!account) {
      return res.status(404).json({ message: 'Conta não encontrada!' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    account.password = hashedPassword;

    // Remove the reset password token and expiry date from the account
    account.resetPasswordToken = undefined;
    account.resetPasswordExpires = undefined;
    await account.save();
    // Send account email in response
    res.status(200).json({ message: 'Palavra passe atualizada com sucesso!' });
  } catch (error) {
    console.error('Update Account Password Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// TODO: Remove this route in production
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are filled
    if (!email) {
      return res.status(406).json({ message: 'The email field is mandatory' });
    }
    if (!password) {
      return res.status(406).json({ message: 'The password field is mandatory' });
    }

    // if any of the fields don't have the same name as the variable return an error
    if (!req.body.email || !req.body.password) {
      return res.status(406).json({ message: 'Invalid field name' });
    }

    // Check if account already exists
    const accountExists = await Account.findOne({ email });
    if (accountExists) {
      return res
        .status(409)
        .json({ message: 'The email you entered already belongs to an account' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Body of account
    const account = new Account({
      firstName: 'Admin',
      lastName: 'Admin',
      email,
      password: hashedPassword,
      phone: '000000000',
      role: 'admin',
    });

    await account.save();
    console.log('Account created with success!\nAccount Id:', account._id);

    res.status(201).json({ message: 'Account registered!' });
  } catch (error) {
    console.error('Account Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a account
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;

    let account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ message: 'Conta não encontrada!' });
    }

    account.firstName = firstName || account.firstName;
    account.lastName = lastName || account.lastName;
    account.phone = phone || account.phone;

    await account.save();
    res.status(200).json({ message: 'Account updated' });
  } catch (error) {
    console.error('Update Account Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a account
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      return res.status(404).json({ message: 'Conta não encontrada!' });
    }

    res.status(200).json({ message: 'Conta removida com sucesso!' });
  } catch (error) {
    console.error('Delete Account Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  getAll,
  getById,
  verifyToken,
  create,
  resetPassword,
  createAdmin,
  update,
  updatePasswordToken,
  remove,
};
