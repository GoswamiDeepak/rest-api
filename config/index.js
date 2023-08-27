import dotenv from "dotenv";
dotenv.config();
export const { PORT, USERNAME, PASSWORD, DEBUG_MODE, JWT_SECRET, REFRESH_SECRET, APP_URL } = process.env;
