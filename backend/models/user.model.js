import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    logo: {
        type: String
    }
});

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    links: [linkSchema]
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
        },
        sections: [sectionSchema]
    }, 
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Define the standalone functions
const findOne = async (criteria) => {
    return await User.findOne(criteria);
};

const findById = async (id) => {
    return await User.findById(id);
};

const findByIdAndUpdate = async (id, update) => {
    return await User.findByIdAndUpdate(id, update, { new: true });
};

export default User;
export { findOne, findById, findByIdAndUpdate };