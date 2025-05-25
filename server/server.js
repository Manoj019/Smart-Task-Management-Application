// server.js
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');


// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;


const allowedOrigins = [
   // Production frontend
  'http://localhost:5173',     
  'http://localhost:3000',  
      // Local development
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

app.get('/',(req,res)=>{
    res.send('server is running super fast..........hii ')
})

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); // or appropriate query
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

// Serve frontend from ../client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle all unmatched routes with frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on port ${PORT}`);
});
