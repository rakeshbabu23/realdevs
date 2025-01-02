const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message("{{#label}} is not valid");
  }
  return value;
};

module.exports = objectId;
