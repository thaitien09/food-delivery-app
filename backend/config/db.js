import mongoose from "mongoose";

export const ketnoiDB = async () => {
    await mongoose.connect('mongodb+srv://duongthaitien:32934831@cluster0.rmhgsfl.mongodb.net/shopthucan').then(()=>console.log("DB kết nối"));
}