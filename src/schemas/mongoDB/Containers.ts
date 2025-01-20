import mongoose from "mongoose";

const ContainerSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    logo: String,
    stock: [{
        expiryDate: String,
        createAt: String,
        costPrice: Number,
        sellPrice: Number,
        amount: Number
    }],
});

const ContainerModel = mongoose.models.Containers || mongoose.model('Containers', ContainerSchema);

export default ContainerModel;