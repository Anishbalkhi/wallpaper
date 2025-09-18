import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema =  mongoose.Schema({
   name : {
        type : String,
        required : [true, "user name is required"],
        minlength : 3,
        maxlength : 5
    },
    email : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        match : [/^\S+@\S+\.\S+$/, "please use a vaild email"]
    },

    password : {
        type : String,
        required : true,
        minlength : 6,
        select : false
    },

    role : {
        type : String,
        enum : ["user", "manager", "admin"],
        default : "user"
    },
    profile: {
        type : String,
        

    },

     saved: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
    ],
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
    ],
    bio: {
        type : String,
        required : false,
        maxlength : 100
    }


},
{timestamps : true}
);



userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


const User = mongoose.model("User", userSchema);

export default User;