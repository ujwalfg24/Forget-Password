const bcrypt = require("bcrypt");
const User = require("../model/user");
const otp = require("../model/otp");

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.find({ email: email });

    const matched = await bcrypt.compare(password, validUser[0].password);
    if (matched) {
      res.send({ message: "sucessfully logged in" });
    } else {
      res.json({ message: "Password not matched" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

const postRegister = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (name.length < 1 || email.length < 1 || password.length < 1) {
    return res.status(400).json({
      message: "Invalid Name or Password did not match",
    });
  }
  const alreadyUser = await User.find({ email: email });
  if (alreadyUser.length > 0) {
    return res
      .status(400)
      .json({ message: "Already registered customer, login" });
  }
  const hashPass = await bcrypt.hash(password, 10);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: hashPass,
  });
  newUser
    .save()
    .then(() => {
      return res
        .status(201)
        .json({ message: "Registered successfully, login" });
    })
    .catch((err) => console.log(err));
};

const emailSend = async (req, res) => {
  let data = await User.find({ email: req.body.email });
  const responseType = {};
  if (data) {
    let otpcode = Math.floor(Math.random() * 100000 + 1);
    let otpData = new otp({
      customer_Id: data[0]._id,
      email: req.body.email,
      otp: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });
    let otpResponse = await otpData.save();
    if (otpResponse) {
      res.send({ message: " sucessfully otp generated" });
    } else {
      res.json({ message: "failed" });
    }
    res.status(200).json(responseType);
  }
};

const changePassword = async (req, res) => {
  let data = await otp.find({ email: req.body.email, Otp: req.body.otpCode });
  const response = {};
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      res.status(400).json({ message: " otp expired" });
    } else {
      const hashedPassword = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
      let user = await User.updateOne(
        { email: req.body.email },
        { $set: { password: hashedPassword } }
      );
      res.status(200).json("password changed sucessfully");
    }
  } else {
    res.send("invalid otp");
  }
  res.status(200).json(response);
};



module.exports = { postLogin, postRegister, emailSend, changePassword };
