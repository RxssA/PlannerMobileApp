import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ChatScreen() {
    const router = useRouter();
    const { activity } = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [parsedActivity, setParsedActivity] = useState(null);

    useEffect(() => {
        try {
            if (activity) {
                const parsed = JSON.parse(activity);
                setParsedActivity(parsed);
            }
        } catch (error) {
            console.error('Error parsing activity:', error);
            router.back();
        }
    }, [activity]);

    const sendMessage = () => {
        if (newMessage.trim() && parsedActivity) {
            const message = {
                id: Date.now().toString(),
                text: newMessage,
                sender: 'User', 
                timestamp: new Date().toISOString(),
                activityId: parsedActivity._id,
            };
            setMessages([...messages, message]);
            setNewMessage('');
            
        }
    };

    if (!parsedActivity) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.activityTitle}>{parsedActivity.title}</Text>
                <Text style={styles.activityDate}>
                    {new Date(parsedActivity.date).toLocaleDateString()}
                </Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageContainer,
                        item.sender === 'User' ? styles.userMessage : styles.otherMessage
                    ]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                        <Text style={styles.timestamp}>
                            {new Date(item.timestamp).toLocaleTimeString()}
                        </Text>
                    </View>
                )}
                style={styles.messagesList}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    multiline
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <FontAwesome name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 15,
        backgroundColor: '#007AFF',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    activityDate: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5,
    },
    messagesList: {
        flex: 1,
        padding: 15,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e0e0e0',
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
    timestamp: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 