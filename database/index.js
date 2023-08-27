const mongoose = require('mongoose')

const url1 = "mongodb://localhost:27017/ecommerceApi";
const url2 = "mongodb+srv://deepakgoswamiofficial:homxCttfCY3hUM5I@apnaid.fgtdgaf.mongodb.net/test";

mongoose.connect(url1)
.then(()=>{
    console.log('Database connection established')
})
.catch((e)=>{
    console.log(e)
})



