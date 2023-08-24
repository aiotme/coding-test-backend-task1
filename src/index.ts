import express, { Request, Response } from 'express';

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface TaskUpdates {
  description?: string;
  completed?: boolean;
}

// Define a TaskManager class to manage tasks
class TaskManager {
  tasks: Task[];
  currentId: number;

  constructor() {
    this.tasks = [];
    this.currentId = 0;
  }

  // Add a new task to the task list
  addTask(description: string): Task {
    const task = { id: this.currentId++, description, completed: false };
    this.tasks.push(task);
    return task;
  }

  // Retrieve a specific task by ID
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  // Update a specific task by ID
  updateTaskById(id: number, updates: TaskUpdates): Task | null {
    const task = this.getTaskById(id);
    if (!task) return null;
    Object.assign(task, updates);
    return task;
  }

  // Delete a specific task by ID
  deleteTaskById(id: number): Task | null {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return null;
    return this.tasks.splice(index, 1)[0];
  }

  // List all tasks
  getAllTasks(): Task[] {
    return this.tasks;
  }
}

// Create a new task manager
const taskManager = new TaskManager();

const app = express();
const port = process.env.PORT || "8888";

// Middleware to parse JSON request bodies
app.use(express.json());

// List all tasks
app.get('/tasks', (req: Request, res: Response) => {
  const tasks = taskManager.getAllTasks();
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req: Request, res: Response) => {
  const description = req.body.description;
  const task = taskManager.addTask(description);
  res.json(task);
});

// Retrieve a specific task
app.get('/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const task = taskManager.getTaskById(id);
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    res.json(task);
  }
});

// Update a specific task
app.put('/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updates = req.body as TaskUpdates;
  const task = taskManager.updateTaskById(id, updates);
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    res.json(task);
  }
});

// Delete a specific task
app.delete('/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const task = taskManager.deleteTaskById(id);
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    res.json(task);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
