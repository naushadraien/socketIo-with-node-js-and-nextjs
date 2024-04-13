"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Socket = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:4000", {
        withCredentials: true,
      }),
    []
  );

  //   socket.emit("hey", "i am hey");
  const [socketId, setSocketId] = useState("");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket?.id ?? "");
    });

    socket.on("received-message", (message) => {
      console.log(message);

      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      //this is when component unmount
      socket.disconnect();
    };
  }, [socket]);

  const handleRoomJoin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("join-room", roomName); // this is for joining the room and this is for private chat only and this is for the client side
  };

  const handleMessageSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("message", { room, message }); //this is for sending the message to the server or emitting the message to the server with the room id
    setMessage("");
    setRoom("");
  };
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            This is for sending the message in the group who joined the group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleRoomJoin}
            className="mx-auto my-0 flex flex-col gap-2"
          >
            <Input
              placeholder="Enter a room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>My socket id is: {socketId}</CardTitle>
          <CardDescription>
            This is for sending message to the specific room id or for private
            message
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleMessageSend}
            className="mx-auto my-0 flex flex-col gap-2"
          >
            <Input
              placeholder="Enter a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Input
              placeholder="Enter room Id"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {messages.map((message, idx) => (
            <div key={idx}>{message}</div>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Socket;
