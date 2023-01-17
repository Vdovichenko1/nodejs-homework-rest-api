const service = require("../../service/users");
const { hashPassword, comparePassword } = require("../../password");
const { generateToken } = require("../../token");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs/promises");

const registerUser = async (req, res, next) => {
  const user = req.body;
  user.password = await hashPassword(user.password);
  user.avatarURL = gravatar.url(user.email, { s: "200" }, false);
  try {
    const { email, subscription, avatarURL } = await service.createUser(user);
    res.status(200).json({ user: { email, subscription, avatarURL } }).end();
  } catch (e) {
    if (e.code === 11000) {
      res
        .status(409)
        .json({
          message: "Email in use",
        })
        .end();
    } else {
      throw err;
    }
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await service.regLogUser(email);
  const passwordMatches = await comparePassword(password, user.password);
  try {
    if (passwordMatches) {
      const token = await generateToken({ id: user._id });
      service.updateUser(user._id, { token });
      res.json({
        status: "success",
        code: 200,
        user: {
          email: user.email,
          subscription: user.subscription,
          token: token,
          avatarURL: user.avatarURL,
        },
      });
    } else {
      res
        .status(401)
        .json({
          message: "Email or password is wrong",
        })
        .end();
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await service.updateUser(_id, { token: "" });
  res.status(204).end();
};

const getCurrentUser = async (req, res) => {
  try {
    console.log("1111");
    res
      .json({
        status: "success",
        code: 200,
        data: {
          email: req.user.email,
          subscription: req.user.subscription,
        },
      })
      .end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res) => {
  const { email, subscription } = await service.updateUser(req.user._id, {
    subscription: req.body.subscription,
  });
  res.json({ email, subscription }).end();
};

const updateUserPhoto = async (req, res) => {
  const { _id } = req.user;
  const { path } = req.file;

  try {
    Jimp.read(path).then((path) => {
      return path
        .resize(250, 250) // resize
        .write(`public/avatars/${_id}`); // save
    });
    await fs.unlink(path);
    const { avatarURL } = await service.updateUser(_id, {
      avatarURL: `/avatars/${_id}`,
    });
    res.status(200).json({ avatarURL }).end();
  } catch (error) {
    console.error(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  update,
  updateUserPhoto,
};
