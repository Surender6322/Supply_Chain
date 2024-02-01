const db = require("../db/index")
const Inventory = db.inventory


const addItem = async(req,res)=>{
    try{
        const user = req.user
        if (!user || user.getDataValue("role") !== "Manager") {
            return res.status(401).send({ error: "Please authenticate as a manager!" });
        }
        const newItem = await Inventory.create(req.body)
        res.status(201).json({message : "Inventory item add successfully", newItem})
    }catch(e){
        res.status
    }
}

module.exports = {
    addItem
}