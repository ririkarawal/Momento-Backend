const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');
const uploadRoute = require('./routes/uploadRoute');
const categoryRoute = require('./routes/categoryRoute');
const categoryUploadRoute = require('./routes/categoryUploadRoute');
const commentRoute = require('./routes/commentRoute');
const pinRoute = require('./routes/pinRoute');
const reminderRoute = require('./routes/reminderRoute');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Creating a Server
const app = express();

// Serving static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Creating a port
const PORT = process.env.PORT || 5000;

// Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.send("Welcome to the web page");
});

// Use routes
app.use('/users', userRoute);
app.use('/uploads', uploadRoute);
app.use('/categories', categoryRoute);
app.use('/categoryuploads', categoryUploadRoute);
app.use('/comments', commentRoute);
app.use('/pins', pinRoute);
app.use('/reminders', reminderRoute);

// Sync database models
sequelize.sync().then(() => {
    console.log('Database models synchronized');
}).catch(err => {
    console.error('Failed to sync database:', err);
});

// Running on PORT
app.listen(PORT, () => {
    console.log(`Server Running on........................PORT ${PORT}`);
});