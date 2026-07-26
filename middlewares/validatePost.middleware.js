const joi = require("joi");

const validatePost = (req, res, next) => {
  const postSchema = joi.object({
    task: joi.string().min(3).max(100).required(),
    completed: joi.boolean().default(false),
  });
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validatePatch = (req, res, next) => {
  const patchSchema = joi.object({
    completed: joi.boolean().required(),
  });

  const { error } = patchSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateId = (req, res, next) => {
  const idSchema = joi.object({
    id: joi.string().hex().length(24).required().messages({
      "string.length": "ID must be a 24-character hex string",
      "string.hex": "ID must contain only hexadecimal characters",
    }),
  });

  const { error } = idSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateQuery = (req, res, next) => {
  const querySchema = joi.object({
    completed: joi.boolean(), // Joi automatically casts string "true"/"false" to boolean
  });

  const { error, value } = querySchema.validate(req.query);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  req.query = value;
  next();
};

module.exports = {
  validatePost,
  validatePatch,
  validateId,
  validateQuery,
};
