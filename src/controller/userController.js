const userModel = require("../Model/userModel")

const registerUser = async (req, res) => {
    try {
        let data = req.body
        let image = req.files
        if (Object.keys(data).length == 0)
            return res
                .status(400)
                .send({ status: false, message: "please give some data" });
                
        const { fname, lname, email, phone, password, address, } = data
        if (!fname) return res.status(400).send({})

    }
}