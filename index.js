import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./src/lib/db.js";
import loginRoutes from "./src/routes/login.route.js";
import reservasiRoutes from "./src/routes/reservasi.route.js";
import roomRoutes from "./src/routes/room.route.js";
import fasilitasRoutes from "./src/routes/fasilitas.route.js";
import hotelRoutes from "./src/routes/hotel.route.js";
import paymentRoutes from "./src/routes/payment.route.js";

import { startAutoCheckout } from "./src/lib/autoCheckout.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.disable("etag");

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(ExpressMongoSanitize());

app.use("/auth", loginRoutes);
app.use("/hotel", hotelRoutes);
app.use("/room", roomRoutes);
app.use("/reservasi", reservasiRoutes);
app.use("/fasilitas", fasilitasRoutes);
app.use("/payment", paymentRoutes);

startAutoCheckout();

app.get("/", (req, res) => {
  res.send("API Online 🚀");
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("✅ Backend running on port:", PORT);
  });
});
