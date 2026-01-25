const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  res.send({ message: "create user" });
};

exports.findAll = async (req, res, next) => {
  res.send({ message: "list users" });
};

exports.findOne = async (req, res, next) => {
  res.send({ message: "get user detail" });
};

exports.update = async (req, res, next) => {
  res.send({ message: "update user" });
};

exports.delete = async (req, res, next) => {
  res.send({ message: "delete user" });
};
