import express from "express";
import cors from "cors";
import basesRoutes from "./routes/basesRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", basesRoutes);
app.use("/api", chatRoutes);

export default app;
