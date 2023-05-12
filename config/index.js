require('dotenv').config();
const {PORT} = process.env
const {PASSWORD} =  process.env

console.log(PASSWORD)

module.exports = PORT;
module.exports = PASSWORD;
