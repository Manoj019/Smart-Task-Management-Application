// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://smarttask.duckdns.org', // your frontend domain here
  credentials: true
}));

app.use(express.json());

// Routes
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/tasks', taskRoutes);


app.get('/',(req,res)=>{
    res.send('server is running super fast..........hii ')
})
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
