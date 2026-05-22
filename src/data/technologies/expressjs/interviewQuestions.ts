import type { TopicNode } from "@/data/types";

export const expressInterviewQuestions: TopicNode = {
  id: "express-interview",
  title: "Interview Questions",
  iconName: "HelpCircle",
  theory: "Test your knowledge on Express.js with these common interview questions tailored for full-stack developers.",
  theoryDetail: {
    comparisons: [
      {
        title: "1. What is Express.js and how does it differ from raw Node.js 'http'?",
        points: [
          "Raw Node.js 'http' requires manually parsing URLs, reading streams for request bodies, and handling routing via complex if/else blocks.",
          "Express.js abstracts this away. It provides an intuitive routing system (app.get), built-in body parsing middleware (express.json), and the powerful concept of a sequential middleware chain."
        ]
      },
      {
        title: "2. What exactly is middleware in Express?",
        points: [
          "Middleware are functions that execute sequentially during the lifecycle of a request.",
          "They have access to the request object (req), response object (res), and the next() function.",
          "They can execute any code, modify the req/res objects, end the request cycle (e.g. res.send), or pass control to the next middleware."
        ]
      },
      {
        title: "3. Explain the difference between app.use() and app.get().",
        points: [
          "app.use() applies middleware to ALL HTTP methods (GET, POST, etc.) and acts as a prefix matcher. (e.g., app.use('/api', ...) matches '/api/users' and '/api/auth').",
          "app.get() applies ONLY to the HTTP GET method and requires an exact path match (or regex match)."
        ]
      },
      {
        title: "4. How do you handle 404 Not Found errors in Express?",
        points: [
          "Since Express executes middleware sequentially, you handle 404s by placing a catch-all middleware at the very end of your route definitions, right before the global error handler.",
          "Example: app.use((req, res, next) => { res.status(404).json({ error: 'Not Found' }); });"
        ]
      },
      {
        title: "5. What is the signature of an error-handling middleware?",
        points: [
          "It must have exactly four arguments: (err, req, res, next).",
          "Express recognizes it as an error handler solely by the fact that it has 4 arguments."
        ]
      },
      {
        title: "6. How does Express handle asynchronous code? What happens if a promise rejects?",
        points: [
          "In Express 4, if a promise rejects inside an async route handler, Express does not catch it automatically.",
          "The request will hang and eventually time out, or it will crash the Node process.",
          "You must wrap async code in try/catch and pass the error via next(err), or use an async wrapper function."
        ]
      },
      {
        title: "7. Why do we need CORS middleware in a full-stack application?",
        points: [
          "Browsers enforce the Same-Origin Policy, which blocks a frontend (e.g., localhost:3000) from making API requests to a backend on a different origin (e.g., localhost:5000).",
          "The CORS (Cross-Origin Resource Sharing) middleware in Express adds specific HTTP headers to the response, telling the browser that it's safe to allow the frontend to read the data."
        ]
      }
    ]
  },
  children: [],
};
