import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const port = 4000;
const JWT_SECRET_KEY = "Rehanisagoodboysdbhgfghi";
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "PATCH"],
        credentials: true,
    },
});
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
}));
app.use("/login", (req, res) => {
    const token = jwt.sign({ _id: "sgnsfgbdigdfnbgkd" }, JWT_SECRET_KEY);
    res
        .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
        .json({
        success: true,
        message: "login success",
    });
});
io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err)
            return next(err);
        const token = socket.request.cookies.token;
        if (!token)
            return next(new Error("Authentication Error"));
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        console.log("decoded user", decoded);
        next();
    });
});
io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    //   socket.on("hey", (data) => {
    //     console.log(data);
    //   });
    socket.on("message", ({ room, message }) => {
        // this is for receiving the message from the client side
        console.log(room, message);
        // socket.broadcast.emit("received-message", message); // this is for sending the message to everyone except the user who sent this message
        // io.emit("received-message", message); // this is for sending the message to everyone including the user who sent this message
        socket.to(room).emit("received-message", message); //this is for sending the message to the specific room only and not to everyone and this is use for private chat
    });
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    }); //this is for joining the room and this is for private chat only and this is for the server side
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});
app.get("/", (req, res) => {
    res.send("Api base url is /api/v1");
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
