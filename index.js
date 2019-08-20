const express = require("express");

const server = express();
server.use(express.json());

const projects = [];

let requestCounter = 0;

const logRequest = (req, res, next) => {
  console.log(`Number of requisitions: ${(requestCounter += 1)}`);
  next();
};

const checkIfProjectExists = (req, res, next) => {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  next();
};

server.post("/projects", logRequest, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(projects);
});

server.get("/projects", logRequest, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", logRequest, checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(project => project.id == id);
  project.title = req.body.title;
  return res.json(projects);
});

server.delete("/projects/:id", logRequest, checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id == id);
  projects.splice(index, 1);
  res.send();
});

server.post(
  "/projects/:id/tasks",
  logRequest,
  checkIfProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(project => project.id == id);
    project.tasks.push(title);
    return res.json(projects);
  }
);

server.listen(3000);
