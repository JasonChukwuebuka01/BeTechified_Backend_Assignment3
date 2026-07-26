const express = require("express");
const app = express();
const logger = require("./middlewares/logger.middleware");
const {
  validatePost,
  validatePatch,
  validateId,
  validateQuery,
} = require("./middlewares/validatePost.middleware");
const globalErrorHandler = require("./middlewares/globalError.middleware");
const connectDB = require("./config/db");
const todoModel = require("./models/todoModel");
require("dotenv").config();

app.use(express.json());

connectDB();

app.use(logger);

// GET All – Read
app.get("/todos", validateQuery, async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed;
    }

    const todos = await todoModel.find(filter);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});

//Get One – Read
app.get("/todos/:id", validateId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await todoModel.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "No todo found" });
    }
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
});

// POST New – Create
app.post("/todos", validatePost, async (req, res, next) => {
  const { task, completed = false } = req.body;
  try {
    const newTodo = await todoModel.create({
      task,
      completed,
    });

    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
});

// PATCH Update – Partial
app.patch("/todos/:id", validatePatch, async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (err) {
    next(err);
  }
});

// DELETE Remove
app.delete("/todos/:id", validateId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedTodo = await todoModel.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    next(error);
  }
});

app.use(globalErrorHandler);

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
