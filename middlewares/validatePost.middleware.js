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

module.exports = {
  validatePost,
  validatePatch,
};
