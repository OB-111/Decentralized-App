const express = require("express");
const User = require("../models/userModel.js");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

exports.creatKeys = function () {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "der",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "der",
    },
  });
  return {
    publicKey: publicKey.toString("base64"),
    privateKey: privateKey.toString("base64"),
  };
};

///////Querying alluser data///////
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

///////Querying all spesific user data///////
const getspecUser = async (req, res) => {
  const userName = req.params.userName;
  try {
    const user = await User.findOne({
      userName: userName,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

///////add User data to db///////
const createUser = async (req, res) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const userType = req.body.userType;
  let newUser;

  if (userType === "seller") {
    newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      userType: req.body.userType,
      amount: 1000,
      keys: this.creatKeys(),
      hash: hashedPassword,
      salt: salt,
    });
  } else {
    newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      userType: req.body.userType,
      hash: hashedPassword,
      salt: salt,
    });
  }

  try {
    if (
      await User.findOne({
        userName: req.body.userName,
      })
    ) {
      return;
    } else {
      await newUser.save();
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.send(null);
  }
};

///////creat SECURE LOGIN///////
const loginUser = async (req, res) => {
  const userName = req.body.userName;
  const user = await User.findOne({
    userName: req.body.userName,
  });
  if (!user) {
    return res.status(400).send("Not Allowed");
  }
  try {
    const match = await bcrypt.compare(req.body.password, user.hash);
    if (match) {
      res.send(user);
    } else {
      return res.status(401).send();
    }
  } catch (e) {
    res.status(500).send();
  }
};

const signData = async (req, res) => {
  let data = req.body.data;
  let privateKey = req.body.privateKey;
  privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKey, "base64"),
    type: "pkcs8",
    format: "der",
  });

  const sign = crypto.createSign("SHA256");
  sign.update(data);
  const signature = sign.sign(privateKey).toString("base64");
  res.send(signature);
};

///////verify data and signature by owner publicKey///////
const verify = async (req, res) => {
  let { data, publicKey, signature } = req.body;

  publicKey = crypto.createPublicKey({
    key: Buffer.from(publicKey, "base64"),
    type: "spki",
    format: "der",
  });

  const verify = crypto.createVerify("SHA256");
  verify.update(data);
  verify.end();
  let result = verify.verify(publicKey, Buffer.from(signature, "base64"));
  res.send(result);
};

//update details
const updateUser = async (req, res) => {
  const currentAmount = req.body.amount;
  const userName = req.body.userName;

  try {
    const user = await User.findOneAndUpdate(
      {
        userName,
      },
      {
        amount: currentAmount,
      },
      {
        new: true,
      }
    );
    res.status(202).json({
      user: user,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

///////delete details///////
const deletUser = async (req, res) => {
  const userName = req.body.userName;
  try {
    await User.findOneAndRemove({
      userName: userName,
    });
    res.status(203).json({
      userName: userName,
    });
  } catch (error) {
    res.status(402).json({
      message: error.message,
    });
  }
};

//export all
module.exports.getAllUsers = getAllUsers;
module.exports.getspecUser = getspecUser;
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.signData = signData;
module.exports.verify = verify;
module.exports.updateUser = updateUser;
module.exports.deletUser = deletUser;
