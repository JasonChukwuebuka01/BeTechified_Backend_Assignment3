const express = require("express");
const app = express();
const logger = require("./middlewares/logger.middleware");
const {
  validatePost,
  validatePatch,
} = require("./middlewares/validatePost.middleware");
const globalErrorHandler = require("./middlewares/globalError.middleware");

app.use(express.json());
app.use(logger);

let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build CRUD API", completed: true },
];

// GET All – Read
app.get("/todos", (req, res, next) => {
  try {
    //throw new Error("Simulated error for testing global error handler");
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});

//Get One – Read
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.status(200).json(todo);
});

// POST New – Create
app.post("/todos", validatePost, (req, res, next) => {
  const { task, completed } = req.body;
  try {
    const newTodo = {
      id: todos.length + 1,
      task,
      completed: completed !== undefined ? completed : false,
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
});

// PATCH Update – Partial
app.patch("/todos/:id", validatePatch, (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: "Not found" });
  res.status(204).send(); // Silent success
});

app.get("/todos/completed", (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.status(200).json(completed); // Custom Read!
});

app.get("/Api/todos/active", (req, res) => {
  //Added Api to the route to avoid conflict with the /todos/:id route

  const active = todos.filter((t) => !t.completed);
  res.status(200).json(active); // Custom Read!
});

app.use(globalErrorHandler);

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
