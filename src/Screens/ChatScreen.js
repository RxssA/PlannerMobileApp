import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import io from "socket.io-client";

const URL_socket = io("http://18.214.225.15:5000");

const ChatScreen = ({ route }) => {
    const { activity } = route.params;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(activity?.messages || []);

    useEffect(() => {
        URL_socket.on("receiveMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    }, []);

    const sendMessage = () => {
        const newMessage = { sender: "User", message, timestamp: new Date() };
        URL_socket.emit("sendMessage", newMessage);
        setMessage("");
    };

    
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text>{item.sender}: {item.message}</Text>}
                contentContainerStyle={{ padding: 10 }}
            />
            <View style={{ flexDirection: 'row', padding: 10 }}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    style={{ flex: 1, marginRight: 10, borderWidth: 1, padding: 8 }}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

export default ChatScreen;
