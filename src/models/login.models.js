import mongoose from "mongoose";

const loginSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    notelp: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Admin", "Super Admin"],
      default: "Admin",
    },
  },

  { timestamps: true }
);

const Login = mongoose.model("Login", loginSchema);
export default Login;
