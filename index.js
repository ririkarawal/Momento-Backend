//Initialization
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');
const uploadRoute = require('./routes/uploadRoute');
const categoryRoute = require('./routes/categoryRoute');
const categoryUploadRoute = require('./routes/categoryUploadRoute');
const commentRoute = require('./routes/commentRoute');
const pinRoute = require('./routes/pinRoute');
const reminderRoute = require('./routes/reminderRoute');

//Creating a Server
const app = express();

//Creating a port
const PORT = process.env.PORT || 8092

//Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/login',(req, res)=>{
    res.send("Welcome to the web page")
})


app.use('/users', userRoute);
app.use('/uploads', uploadRoute);
app.use('/categories', categoryRoute);
app.use('/categoryuploads', categoryUploadRoute);
app.use('/comments', commentRoute);
app.use('/pins', pinRoute);
app.use('/reminders', reminderRoute);

//Running on PORT
app.listen(PORT, ()=>{
    console.log(`Server Running on........................ PORT ${PORT}`)
})


