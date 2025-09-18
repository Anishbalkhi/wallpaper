
import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        minlength : 6,
        maxlength : 100
    },
     likes : {
        type : Number,
        default : 0
     },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    author : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User",
        required : true
    }

},
 {timestamps : true});


const Post = mongoose.model("Post" ,postSchema )


export default Post