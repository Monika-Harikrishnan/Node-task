const Role = require('../models/role.model.js');
const RoleSchema = require('../Service/roleValidate.js');
//find all
exports.retrieveRole = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const startIndex = (page - 1) * limit;
        const totalRoles = await Role.countDocuments();
        const roles = await Role.find()
            .limit(limit)
            .skip(startIndex)
            .exec();
        const transformedRoles = roles.map(role => ({
            role_id: role._id,
            role_name: role.role_name,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        }));

        res.status(200).json({
            message: "Success",
            page,
            totalRoles,
            data: transformedRoles
        });
    } catch (error) {
        res.status(500).json({
            message: "Data not found",
            data: []
        });
    }
};

//find by id
exports.retrieveRoleId = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        const transformedRoles = {
            role_id:role._id,
            role_name: role.role_name,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        };
        res.status(200).json({
            message : "success",
            data : transformedRoles
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Id not found",
            data : []
         });
    }
};

//create
exports.createRole = async (req,res)=>{
    try{
        const{error} = RoleSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = {};
            error.details.forEach(err => {
                if (err.type === 'object.unknown') {
                    errorMessages[err.context.key] = `${err.context.key} is invalid`;
                } else {
                    errorMessages[err.path[0]] = err.message;
                }
            });
            
            return res.status(400).json({
                message : "validation failed : check the input field",
                errors: errorMessages 
            });
        }
       const newRole = await Role.create(req.body);
       const transformedRoles = {
        role_id:newRole._id,
        role_name: newRole.role_name,
        createdAt: newRole.createdAt,
        updatedAt: newRole.updatedAt
    };
       res.status(201).json({
        message : "validation passed",
        data : transformedRoles
    });
    }
    catch(error){
        res.status(500).json({message: "Invalid"});
    }
};

//update
exports.updateRole = async (req,res)=>{
    try{
        const {id} = req.params;
        const role = await Role.findByIdAndUpdate(id,req.body);
        if(!role){
            res.status(404).json({message: "role not found"});
        }
        res.status(200).json({
            message : "Role Id updated successfully"
        });
    }
    catch(error){
        res.status(500).json({message:"Role Id not found"});
    }
};

//delete
exports.deleteRole = async (req,res)=>{
    try{
        const {id} = req.params;
        const role = await Role.findByIdAndDelete(id);
        if(!role){
            res.status(404).json({message: "Role not found"});
        }
        res.status(200).json("Role deleted successfully");
    }
    catch(error){
        res.status(500).json({message:"Role Id not found"});
    }
};
