import express from "express";
const router = express.Router();
import { registerController, loginController } from "../controller";
import auth from "../middleware/auth";
import userController from "../controller/auth/userController";
import refreshController from "../controller/auth/refreshController";
import product from "../controller/productController";
import admin from "../middleware/admin";

router.post("/api/register", registerController.register);
router.post("/api/login", loginController.login);
router.get("/api/me", auth, userController.me);
router.post("/api/refresh", refreshController.refresh);
router.post("/api/logout", auth, loginController.logout);
router.post("/api/products", [auth, admin], product.store);
router.put("/api/products/:id", [auth, admin], product.update);
router.delete("/api/products/:id", [auth, admin], product.destroy);
router.get("/api/products",product.index);
router.get("/api/products/:id",product.show);

export default router;
