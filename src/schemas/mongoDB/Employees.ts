import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    username: String,
    password: String,
    profile: {
        name: String,
        age: Number,
        gender: String,
        image: String
    }
});

const EmployeeModel = mongoose.models.Employees || mongoose.model('Employees', EmployeeSchema);

export default EmployeeModel;