const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/product.model.js');
const ProductSchema = require('./Service/productValidate.js');
const cronJobs = require('./Service/cronJob');
const app = express();
app.use(express.json());

app.listen(3000,()=>{
    console.log("server running");
});

const userroutes = require('./routes/routeuser.js');
app.use('/api', userroutes);

const roleroutes = require('./routes/routerole.js');
app.use('/api', roleroutes);





app.get('/',(req,res)=>{
    res.send("hello from api update");
});

//find all
app.get('/api/products', async (req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 3;
        const startIndex = (page - 1) * limit;
        const totalProducts = await Product.countDocuments();
        const products = await Product.find()
        .limit(limit)
        .skip(startIndex)
        .exec();
        const transformedProducts = products.map(product => ({
            id: product._id, 
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));
        res.status(200).json({
            message : "Success",
            page,
            totalProducts,
            data : transformedProducts
        });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

//find by id
app.get('/api/products/:id', async (req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

//create
app.post('/api/products', async (req,res)=>{
    try{
        const{error} = ProductSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = {};
            error.details.forEach(err => {
                errorMessages[err.path[0]] = err.message;
            });
            
            return res.status(400).json({
                message : "validation failed : check the input field",
                errors: errorMessages 
            });
        }
       const newProduct = await Product.create(req.body);
       res.status(201).json({
        message : "validation passed",
        data : newProduct
    });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

//update
app.put('/api/products/:id', async (req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id,req.body);
        if(!product){
            res.status(404).json({message: "product not found"});
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

//delete
app.delete('/api/products/:id', async (req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            res.status(404).json({message: "product not found"});
        }
        res.status(200).json("product deleted successfully");
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});


mongoose.connect("mongodb://localhost:27017/Node-API")
.then(() => {
    console.log("Database connected");
})
.catch((error) => {
    console.log("Database connection failed", error);
});

// hello