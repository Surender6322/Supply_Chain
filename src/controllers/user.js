const db = require("../db/index")
const User = db.users

const register = async (req, res) => {
    try {
        const totalUserCount = await User.count();
        // console.log("AgainCount", existingUsersCount);
        if (totalUserCount > 0) {
            const user = req.user;
            if (!user || user.getDataValue("role") !== "Manager") {
                return res
                    .status(401)
                    .send({ error: "Please authenticate as a manager!" });
            }
        }
        const user = await User.create(req.body)
        const token = await user.generateToken()
        res.status(201).json({ message: "Registration successfully!" })


    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        res.status(200).json({ message: "Login successfully!" })
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const logoutall = async (req, res) => {
    try {
        const curruser = req.user;
        curruser.tokens = "[]";
        await curruser.save();
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    register,
    login,
    logoutall
}