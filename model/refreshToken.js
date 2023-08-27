import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const tokenSchema = new Schema(
  {
    token: {
      type: "string",
      unique: true,
    },
  },
  { timestamps: false }
);

export default Mongoose.model("RefreshToken", tokenSchema, "RefreshTokens");
