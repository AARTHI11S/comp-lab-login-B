import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes";
import UserRoutes from "./routes/UserRoutes";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());

const dbCluster = process.env.DB_CLUSTER || "localhost:27017";
const dbName = process.env.DB_NAME || "";
const dbUserName = process.env.DB_USER || "";
const dbPassword = process.env.DB_PASSWORD || "";

mongoose
  .connect(
    `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`,

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/students", studentRoutes);
app.use("/api/users", UserRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
