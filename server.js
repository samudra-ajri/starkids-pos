const express = require('express');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(fileupload());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/items', require('./routes/api/items'));
app.use('/api/customers', require('./routes/api/customers'));
app.use('/api/transactions', require('./routes/api/transactions'));
app.use('/api/materials', require('./routes/api/materials'));
app.use('/api/artisans', require('./routes/api/artisans'));
app.use('/api/artisantransactions', require('./routes/api/artisantransactions'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
