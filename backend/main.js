import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js"
import dataRouter from "./routes/dataRouter.js"
import pageRouter from "./routes/pageRouter.js"
import teamRouter from "./routes/teamRouter.js"
import aiRouter from "./routes/aiRouter.js"
import blog from "./routes/blog.js"
import session from "express-session"


async function connect() {
  await mongoose.connect("mongodb+srv://thegangstaguy001:v8uZhle7W43jKERL@cluster0.nh1ewxi.mongodb.net/RoreReality?retryWrites=true&w=majority");
  console.log('Connected to MongoDB');
}

connect()

const app = express();
app.use(express.json())
app.use(session({
  secret: "my-secret",
  resave: false,
}))

app.use(cors({
  origin: ["https://97d80959-5b1b-4748-88fd-0730300aa077-00-ujkgbvig4vzx.riker.replit.dev", "https://a75e2c95-e819-49bc-aa87-3cf6ed94ec8e-00-3uyd7u3ut5p6r.riker.replit.dev:3000"]
}));

app.use("/user", userRouter)
app.use("/property", dataRouter)
app.use("/page", pageRouter)
app.use("/team", teamRouter)
app.use("/chat", aiRouter)
app.use("/blog", blog)

app.get("/api", (req, res)=>{
  res.json({message: "Hello from server"})
});

app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})