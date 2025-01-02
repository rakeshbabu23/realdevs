const Joi = require("joi");
const pick = require("../utils/pick");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const validSchema = pick(schema, [
      "params",
      "query",
      "body",
      "cookies",
      "headers",
    ]);

    const validatedValues = {};

    const validationResults = Object.keys(validSchema)
      .map((key) => {
        const schemaPart = validSchema[key];
        const { error, value } = schemaPart.validate(req[key], {
          abortEarly: false,
          errors: { label: "key" },
        });

        if (error) {
          return {
            key,
            error: error.details.map((err) => err.message).join(", "),
          };
        }

        validatedValues[key] = value;
        return null; // No error
      })
      .filter((result) => result !== null);

    if (validationResults.length > 0) {
      const errors = validationResults.map((res) => res.error).join(", ");
      return res.status(400).json({ errors });
    }

    req.values = validatedValues;

    next();
  };
};

module.exports = validateSchema;
