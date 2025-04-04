import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatScreen = ({ route }) => {
    const { activity } = route.params;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(activity.messages || []);

    useEffect(() => {
        socket.on("receiveMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    }, []);

    const sendMessage = () => {
        const newMessage = { sender: "User", message, timestamp: new Date() };
        socket.emit("sendMessage", newMessage);
        setMessage("");
    };

    return (
        <View>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text>{item.sender}: {item.message}</Text>}
            />
            <TextInput value={message} onChangeText={setMessage} placeholder="Type a message" />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

export default ChatScreen;
