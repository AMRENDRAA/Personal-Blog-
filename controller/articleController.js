const articlemodel = require("../Models/articleModel");



const getallarticle = async (req, res) => {

    try {

        const getid = await articlemodel.find({});

        res.status(200).json({

            status: "Success",
            data: getid
        })
    } catch (err) {
        res.status(400).json({
            status: "failed",
            err: err.message
        })
    }

}
const createnewarticle = async (req, res) => {


    try {
        const { title, content, date } = req.body;

        if (!title || !content || !date) {
            res.status(400).json({
                status: "Failed",
                message: "Missing fields"
            })
        }

        const createarticle = await articlemodel.create({

            title,
            content,
            date
        })

        res.status(201).json({
            status: "success",
            data: createarticle
        })



    } catch (err) {
        res.status(400).json({
            status: "Failed",
            err: err.message
        })
    }
}


const deletearticle = async (req, res) => {


    try {

        const id = req.params.id;

        const deletedarticle = await articlemodel.findByIdAndDelete(id);


        if (!deletedarticle) {
            return res.status(400).json({
                status: "error",
                message: err.message
            })
        }

        res.status(204).json({
            status: "sUCCESS"
        })


    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message

        })
    }
}

const updatearticle = async (req, res) => {

    try {

        const updateid = await articlemodel.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            }

        )

        if (!updateid) {
            res.status(400).json({
                status: "Failed",
                err: "Please provide all data"
            })
        }


        res.status(200).json({
            status: "Success",
            data: updateid
        })

    } catch (err) {

        res.status(500).json({
            status: "Failed",
            err: message.err
        })

    }
}
module.exports = { getallarticle, createnewarticle, deletearticle, updatearticle }