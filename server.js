import express from "express";
import { PORT } from "./config";
require('./database')
import router from "./routers"
import errorHandler from "./middleware/errorHandler";
import path from 'path'



const app = express();
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({
  extended:false
}))
app.use(express.json());
app.use(router)
app.use(errorHandler);
app.use('/uploads', express.static('uploads'))

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
