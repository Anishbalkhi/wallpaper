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
  },
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);
export default User;