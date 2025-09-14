import express from "express";
import cors from "cors";
import { ketnoiDB } from "./config/db.js";
import MonanRouter from "./routes/foodRoute.js";
import nguoidungRoute from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import revenueRoute from "./routes/revenueRoute.js";

import 'dotenv/config'

// app configconfig
const app = express()
const port = 4000

//middlewaremiddleware
app.use(express.json())
app.use(cors())

// db connection
ketnoiDB();

//api endpoint
app.use("/api/monan",MonanRouter)
app.use("/anh",express.static('uploads'))
app.use("/api/nguoidung",nguoidungRoute)
app.use("/api/cart",cartRoute)
app.use("/api/order",orderRoute)
app.use("/api/revenue", revenueRoute)


app.use("/uploads", express.static("uploads"));
app.get("/",(req,res)=>{
    res.send("Api hoạt động")
})

app.listen(port,()=>{
    console.log(`Server chạy với http://localhost:${port}`)
})

