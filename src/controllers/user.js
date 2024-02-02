const db = require("../db/index")
const User = db.users

const register = async (req, res) => {
    try {
        const totalUserCount = await User.count();
        console.log("AgainCount", totalUserCount);
        if (totalUserCount > 0) {
            const user = req.user;
            if (!user || user.getDataValue("role") !== "Manager") {
                return res.status(401).send({ error: "Please authenticate as a manager!" });
            }
        }
        const user = await User.create(req.body)
        const token = await user.generateAuthToken()
        res.status(201).json({ message: "Registration successfully!", user, token })


    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const login = async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (e) {
        console.log(e);
        res.status(404).send({ error: "Internal server error!" });
    }
};

const logoutAll = async (req, res) => {
    try {
        const user = req.user;
        const updatedTokens = [];
        await User.update({ tokens: updatedTokens }, { where: { id: user.id } });
        res.status(201).send({ message: "Successfully Logged-out." });
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: "Internal server error!" });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(201).json(user);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    register,
    login,
    logoutAll,
    getProfile
}