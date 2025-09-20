// authController.js

export const adminController = (req, res) => {
  res.status(200).json({ msg: "admin" });
};

export const userController = (req, res) => {
  res.status(200).json({ msg: "user" });
};

export const managerController = (req, res) => {
  res.status(200).json({ msg: "manager" });
};
