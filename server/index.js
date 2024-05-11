const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());
require('dotenv').config();



const uri = process.env.MONGO_URI;

async function connect() {
    try {
      await mongoose.connect(uri);
      console.log("Successful connection.");
    } catch (error) {
      console.error(error);
    }
  }
  
  connect();


//Routes
app.use('/api/auth',require('./routes/auth'));

app.get('/',(req,res)=>{
  res.send("hello world")
})

app.listen(port , ()=>{
    console.log('app is at port 8000');
})
