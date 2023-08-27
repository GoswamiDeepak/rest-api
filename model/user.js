import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
    role: {
    type: "string",
    default: 'customer',
  },
}, {timestamps: true});

export default Mongoose.model('User',userSchema,'users')
