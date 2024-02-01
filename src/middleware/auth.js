const jwt = require("jsonwebtoken");
const db = require("../db/index");
const User = db.users;

const auth = async ( req, res, next ) => {
    try{
        const totalUserCount = await User.count()
        if(totalUserCount === 0  && req.body.role === "Staff") {
            next()
            return
        }
        const token = req.header("Authorization").replace("Bearer ","")
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(decoded.userType==="user") {
            const user = await User.findOne({
                where:{
                    id:decoded.id
                }
            })
            // console.log(user)
            if(!user){
                throw new Error("Please signup!!!")
            }
            const userToken = JSON.parse(user.tokens)
            const tokenExists = userToken.some(
                (ut) => ut.token === token
            )
            console.log(tokenExists)
            if(!tokenExists) {
                throw new Error("Authenticate yourself...")
            }
            
            req.token = token
            req.user = user

        }

        next()

    }catch(e) {
        res.status(400).send("Authenticate yourself...")
    }
}

module.exports = auth
