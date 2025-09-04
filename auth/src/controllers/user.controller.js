import User from "../models/user.model.js";

const gooleLogin = (req, res) => {
    const { token, user } = req.user;

    const options = {
        httpOnly: true,
    };

    return res
        .cookie("token", token, options)
        .redirect("http://localhost:5173/home");
};


const getUserProfile = async (req, res) => {
    try {
        const user = req.user
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        return res.status(200).json(user);
    } catch (error) {
        console.log("Failed to get user profile : ",error)
    }
};

const logout = (req, res) => {
    return res
        .status(200)
        .clearCookie("token")
        .json({ message: "User loggout successfully" });
};


export {
    gooleLogin,
    getUserProfile,
    logout
}