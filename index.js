import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./src/lib/db.js";
import loginRoutes from "./src/routes/login.route.js";
import reservasiRoutes from "./src/routes/reservasi.route.js";
import roomRoutes from "./src/routes/room.route.js";
import fasilitasRoutes from "./src/routes/fasilitas.route.js";
import hotelRoutes from "./src/routes/hotel.route.js";
import qrisProxy from "./src/routes/qrisProxy.routes.js";
import cookieParser from "cookie-parser";
import { startAutoCheckout } from "./src/lib/autoCheckout.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://be-reservasi.vercel.app/"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(ExpressMongoSanitize());

app.use("/proxy", qrisProxy);
app.use("/auth", loginRoutes);
app.use("/hotel", hotelRoutes);
app.use("/room", roomRoutes);
app.use("/reservasi", reservasiRoutes);
app.use("/fasilitas", fasilitasRoutes);

startAutoCheckout();

app.get("/", (req, res) => {
  res.send("API Online 🚀");
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("✅ Backend running on port:", PORT);
  });
});
