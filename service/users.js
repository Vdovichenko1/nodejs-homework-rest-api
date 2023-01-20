const User = require("./schemas/user");

const createUser = async (body) => {
  return await User.create(body);
};

const regLogUser = async (email) => {
  return await User.findOne({ email });
};

const currentUser = async (id) => {
  return await User.findOne({ _id: id });
};

const updateUser = async (userId, body) => {
  return await User.findOneAndUpdate({ _id: userId }, body, { new: true });
};

const findVerifyToken = async (token) => {
  return await User.findOneAndUpdate(
    { verificationToken: token, verify: false },
    { verificationToken: null, verify: true },
    { new: true }
  );
};

module.exports = {
  createUser,
  regLogUser,
  currentUser,
  updateUser,
  findVerifyToken,
};
