import mongoose from "mongoose";

async function connectDB() {

    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("chat-auth database connected");
        })
        .catch((err) => {
            console.log("Failed to connect chat-auth database", err);
            process.exit(1);
        });
}

export { connectDB };
