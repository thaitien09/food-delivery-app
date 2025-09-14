// Cart routes removed - using local storage instead
import express from "express"
import {addToCart,removeFromCart,getCart} from "../controllers/cartController.js"
import authMiddleware from "../middleware/auth.js";

const cartRoute = express.Router()

cartRoute.post("/add", authMiddleware, addToCart)
cartRoute.post("/remove", authMiddleware, removeFromCart)
cartRoute.get("/get", authMiddleware, getCart)

export default cartRoute