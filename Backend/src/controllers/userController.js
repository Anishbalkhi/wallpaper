// import User from "../models/User.model.js";



export const adminController = async (req, res)=>{
res.status(200).json({
    msg: "admin"
})
}


export const userController = async (req, res)=>{
res.status(200).json({
    msg: "user"
})
}

export const managerController = async (req, res)=>{
res.status(200).json({
    msg: "manager"
})

}

