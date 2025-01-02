const Joi = require("joi");
const objectId = require("../validation/custom.validation");

const passwordValidation = Joi.string()
  .min(8)
  .required()
  .custom((value, helpers) => {
    // Check for numeric character
    if (!/\d/.test(value)) {
      return helpers.message(
        "Password must contain at least one numeric digit."
      );
    }

    // Check for special symbol
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return helpers.message(
        "Password must contain at least one special symbol."
      );
    }

    return value; // Return the validated value if all checks pass
  }, "Password Validation");

const authenticatedUser = {
  cookies: Joi.object()
    .keys({
      access: Joi.string().optional(),
      refresh: Joi.string().optional(),
      userId: Joi.string().custom(objectId).optional(),
    })
    .unknown(true),
};

const expirationDate = new Date();
const cookiesExpiryDate = expirationDate.setDate(expirationDate.getDate() + 30);
module.exports = { cookiesExpiryDate, passwordValidation, authenticatedUser };
