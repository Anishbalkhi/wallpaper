import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
      suspended: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    profilePic: { url: String, publicId: String },
    bio: { type: String, maxlength: 200 },
    location: { type: String, maxlength: 100 },
    phone: { type: String, maxlength: 20 },
    website: { type: String, maxlength: 200 },
    instagram: { type: String, maxlength: 50 },
    twitter: { type: String, maxlength: 50 },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    purchases: [
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
        pricePaid: Number,
        purchasedAt: Date,
      },
    ],
    earnings: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);
export default User;