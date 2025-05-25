// server.js
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');



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
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/tasks', taskRoutes);


app.get('/',(req,res)=>{
    res.send('server is running super fast..........hii ')
})
app.use((err, req, res, next) => {

    console.log(err);
    
    
    if (err?.statusCode) {
        return res.status(err.statusCode || 500).json(err);
    }
    return res.status(err?.statusCode || 500).json({ error: true, message: err.message });
}) 


app.use('/api/auth', authRoutes);

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on port ${PORT}`);
});
