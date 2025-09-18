import jwt from "jsonwebtoken"


export const verifyToken = async (req, res , next)=>{
    try {
        let token;
        const authHeader = req.headers.Authorization || req.headers.authorization 
        if(authHeader &&  authHeader.startsWith("Bearer")){
            token = authHeader.split(" ")[1];
        if(!token){
            return res.status(404).json({
                msg: "No token , authorization denieduser not found"
            })


        }
        }
            
         const decode = jwt.verify(token, process.env.JWT_SECRET ) 
        } catch (error) {
           res.status(401)
           .json({
            msg: "No token , authorization denied"
           }) 
        }

        
}