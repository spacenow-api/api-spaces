const { NextFunction, Request, Response } = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const AuthenticationTokenMissingException = require("../exceptions/AuthenticationTokenMissingException");
const WrongAuthenticationTokenException = require("../exceptions/WrongAuthenticationTokenException");

const { IUser } = require("./../../interfaces/user.interface");

const Token = require("../utils/token");

const config = require("./../../config");

const fetchUserById = async (id) => {
  const res = await axios.get(`${config.USERS_API_HOST}/users/legacy/${id}`);
  if (res && res.data) {
    const userData = res.data;
    return Promise.resolve(userData);
  }
  return Promise.reject();
};

async function authMiddleware(req, _, next) {
  const token = Token.get(req);
  if (token && token !== "undefined") {
    const secret = process.env.JWT_SECRET || "Spacenow";
    try {
      const { id } = await jwt.verify(token, secret);
      const user = await fetchUserById(id);
      console.debug(`User ${user.email} verified.`);
      req.userIdDecoded = id;
      req.userRoleDecoded = user.role;
      next();
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

async function authAdminMiddleware(
  req,
  _,
  next
) {
  const token = Token.get(req);
  if (token && token !== "undefined") {
    const secret = process.env.JWT_SECRET || "Spacenow";
    try {
      const { id } = await jwt.verify(token, secret);
      const user = await fetchUserById(id);
      if (user.role !== "admin") next(new WrongAuthenticationTokenException());
      console.debug(`Admin ${user.email} verified.`);
      req.userIdDecoded = id;
      req.userRoleDecoded = user.role;
      next();
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export { authMiddleware, authAdminMiddleware };
