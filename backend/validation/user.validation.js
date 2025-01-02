const Joi = require("joi");
const { passwordValidation, authenticatedUser } = require("../utils/helper");
const signup = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    userName: Joi.string().required().messages({
      "any.required": "User name is required",
    }),
    password: passwordValidation.messages({
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
      "custom.passwordValidation":
        "Password must contain at least one numeric digit and one special symbol",
    }),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().email().messages({
      "string.email": "Invalid email format",
    }),
    userName: Joi.string().messages({
      "any.required": "User name is required",
    }),
    password: passwordValidation,
  })
    .xor("email", "userName") // Either email or userName is required
    .required()
    .messages({
      "object.missing": "Either email or user name is required",
    }),
};

const addPortfolio = {
  ...authenticatedUser,
  body: Joi.object({
    url: Joi.string().required(),
    enableComments: Joi.boolean().optional().default(true),
  }),
};

const logout = {
  ...authenticatedUser,
};

module.exports = { signup, login, addPortfolio, logout };
