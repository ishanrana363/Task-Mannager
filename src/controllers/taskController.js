const taskModel = require("../models/taskModel")


// create task

exports.createTask = async (req, res) => {
    try {
        let userEmail = req.headers["email"];
        let reqBody = req.body;
        reqBody.email = userEmail;
        let result = await taskModel.create(reqBody);
        let data = result.toObject();
        delete data.isDelete;
        res.status(201).json({
            data: data,
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString()
        });
    }
};


exports.updateTask = async (req, res) => {
    try {
        let userEmail = req.headers["email"];
        let taskID = req.params.id
        let reqBody = req.body;
        let update = reqBody;
        let filter = { 
            email : userEmail,
            _id : taskID,
            isDelete : false
        };
        let result = await taskModel.updateOne(filter,update,{new:true});

        res.status(201).json({
            status: "success",
            data: result
            
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString()
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        let userEmail = req.headers["email"];
        let userID = req.params.id;
        let filter = { 
            email : userEmail,
            isDelete : false,
            _id : userID
        };
        let update = {isDelete:true};
        let result = await taskModel.updateOne(filter,update);
        res.status(200).json({
            status: "success",
            data: result
            
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString()
        });
    }
};

exports.listByStatusTask = async (req,res) =>{
    try {
        let userEmail = req.headers["email"];
        let taskStatus = req.params.status;
        let filter = {
            email : userEmail,
            status : taskStatus,
            isDelete : false
        }
        let result = await taskModel.find(filter)
        const resData = Array.isArray(result) && result.length > 0
            ? result.map(doc => {
                const taskObject = doc.toObject();
                delete taskObject.isDelete;
                return taskObject
            })
            : [];
    res.status(200).json({
        status: "success",
        data: resData
        
    });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString()
        });
    }
}

exports.statusByCount = async (req, res) => {
    try {
        let email = req.headers["email"];
        let result = await taskModel.aggregate([
            { $match: { email: email } },
            { $group: { _id: "$status", sum: { $count: {} } } }
        ]);

        res.status(200).json({
            status: "success",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString()
        });
    }
};
