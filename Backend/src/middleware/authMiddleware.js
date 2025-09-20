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
             req.user = decode;
             next();
        } catch (error) {
           res.status(401)
           .json({
            msg: "No token , authorization denied"
           }) 
        }

        
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied: Insufficient permissions" });
    }
    next();
  };
};
