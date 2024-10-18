const User = require('../models/user.model.js');
const UserSchema = require('../Service/userValidate.js');
const InvalidatedToken = require('../models/invalidatedToken.model.js'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'moni_secret_key';
const invalidatedTokens = [];

const generateToken = (user) => {
    const payload = {
        id: user._id, 
        email: user.email, 
        role: user.role_id?.role_name
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 
    return token;
};



//login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email }).populate('role_id', 'role_name');
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user);
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phonenumber: user.phonenumber,
                role_id: user.role_id?._id,
                role_name: user.role_id?.role_name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Logout function
exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: 'Token is required for logout' });
        }
        const expiresAt = new Date(Date.now() + 3600000); 

        await InvalidatedToken.create({ token, expiresAt });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//find all
exports.retrieveUser =  async (req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 3;
        const startIndex = (page - 1) * limit;
        const totalUsers = await User.countDocuments();
        const users = await User.find()
        .limit(limit)
        .populate('role_id', 'role_name')
        .skip(startIndex)
        .exec();
        const transformedUsers = users.map(user => ({
            id: user._id, 
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phonenumber: user.phonenumber,
            role_id: user.role_id?._id,  
            role_name: user.role_id?.role_name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
        res.status(200).json({
            message : "Success",
            page,
            totalUsers,
            data : transformedUsers
        });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

//Find By Id
exports.retrieveUserId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const user = await User.findById(id).populate('role_id', 'role_name').exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const transformedUser = {
            id: user._id, 
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phonenumber: user.phonenumber,
            role_id: user.role_id?._id, 
            role_name: user.role_id?.role_name, 
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            message: "User found successfully",
            data: transformedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




//create
exports.createUser = async (req,res)=>{
    try{
        const{error} = UserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = {};
            error.details.forEach(err => {
                if (err.type === 'object.unknown') {
                    errorMessages[err.context.key] = `${err.context.key} is not allowed`;
                } else {
                    errorMessages[err.path[0]] = err.message;
                }
            });
            
            return res.status(400).json({
                message : "validation failed : check the input field",
                errors: errorMessages 
            });
        }
       const newUser = await User.create(req.body);
       const userWithRole = await User.findById(newUser._id).populate('role_id', 'role_name').exec();
       const transformedUser = {
        id: userWithRole._id, 
        firstname: userWithRole.firstname,
        lastname: userWithRole.lastname,
        email: userWithRole.email,
        phonenumber: userWithRole.phonenumber,
        role_id: userWithRole.role_id?._id, 
        role_name: userWithRole.role_id?.role_name, 
        createdAt: userWithRole.createdAt,
        updatedAt: userWithRole.updatedAt
    };
       res.status(201).json({
        message : "validation passed",
        data : transformedUser
    });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

//update
exports.updateUser = async (req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id,req.body);
        if(!user){
            res.status(404).json({message: "user not found"});
        }
        const updatedUser = await User.findById(id);
        res.status(200).json({message : "User updated successfully"});
    }
    catch(error){
        res.status(500).json({message:"Invalid User Id",
            data : []
        });
    }
};

//delete
exports.deleteuser = async (req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            res.status(404).json({message: "User not found"});
        }
        res.status(200).json("User deleted successfully");
    }
    catch(error){
        res.status(500).json({message:"Invalid User Id",
            data : []
        });
    }
};
