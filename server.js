const express = require('express')
const PORT = require('./config')

const app = express();


app.get('/',(req, res)=>{
    res.send("hello world!");
})

app.listen(PORT, ()=>{
    console.log(`Listing on port ${PORT}`);
})
