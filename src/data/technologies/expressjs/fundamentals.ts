import type { TopicNode } from "@/data/types";

export const expressFundamentals: TopicNode = {
  id: "express-fundamentals",
  title: "Express.js Fundamentals",
  iconName: "Server",
  theory:
    "Express.js is the most popular minimal and flexible Node.js web application framework. It provides a robust set of features for web and mobile applications, acting as a thin layer of fundamental web application features without obscuring Node.js features.",
  theoryDetail: {
    keyConcepts: [
      "Application Object (app): The main instance of the Express app used to configure settings and define routes.",
      "Request Object (req): Represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.",
      "Response Object (res): Represents the HTTP response that an Express app sends when it gets an HTTP request.",
      "Middleware: Functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.",
    ],
    whyItMatters:
      "While you can build a web server using pure Node.js (with the 'http' module), it requires a lot of boilerplate for routing, parsing payloads, and handling edge cases. Express simplifies this drastically, making it the industry standard for Node.js REST APIs and microservices.",
    commonPitfalls: [
      "Forgetting to end the response: Not calling res.send(), res.json(), or next() will cause the client to hang until the request times out.",
      "Not parsing the body: Express doesn't parse JSON or URL-encoded bodies by default. You must use express.json() and express.urlencoded() middleware.",
      "Ignoring unhandled promise rejections: Asynchronous route handlers that throw errors will crash the server unless wrapped in a try/catch or passed to next().",
    ],
    examples: [
      {
        title: "Hello World in Express",
        description:
          "The absolute minimum code required to create a running Express server responding to HTTP GET requests.",
        code: `import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Define a route for the root path
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});`,
        language: "javascript",
      },
      {
        title: "Handling JSON Payloads",
        description:
          "How to properly accept and respond with JSON data, the standard for REST APIs.",
        code: `import express from 'express';

const app = express();

// Built-in middleware to parse incoming JSON payloads
app.use(express.json());

app.post('/api/users', (req, res) => {
  // req.body is now a parsed JavaScript object!
  const { username, email } = req.body;
  
  if (!username || !email) {
    // Return early with a 400 Bad Request status
    return res.status(400).json({ error: 'Username and email are required' });
  }

  // Send back a JSON response
  res.status(201).json({
    message: 'User created successfully',
    data: { username, email }
  });
});

app.listen(3000);`,
        language: "javascript",
      },
    ],
  },
  children: [],
};
