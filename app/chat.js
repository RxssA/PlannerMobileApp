import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

// Connect to Socket.io server - use the same URL that's in your API URL but for the socket connection
const SOCKET_URL = "http://192.168.0.23:5000";
const socket = io(SOCKET_URL);

export default function ChatScreen() {
    const router = useRouter();
    const { activity } = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [parsedActivity, setParsedActivity] = useState(null);
    const [image, setImage] = useState(null);
    const [token, setToken] = useState(null);
    const flatListRef = useRef(null);

    // Get token from AsyncStorage
    useEffect(() => {
        const getToken = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                setToken(userToken);
            } catch (error) {
                console.error('Error getting token:', error);
            }
        };
        getToken();
    }, []);

    // Parse activity data
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

    // Load messages when activity is parsed
    useEffect(() => {
        if (parsedActivity && parsedActivity._id) {
            fetchMessages();
            
            // Set up socket event listener for this activity
            socket.on('receiveMessage', (newMsg) => {
                if (newMsg.activityId === parsedActivity._id) {
                    setMessages(prevMessages => [
                        ...prevMessages, 
                        {
                            id: newMsg.id || Date.now().toString(),
                            text: newMsg.text || newMsg.message,
                            image: newMsg.image,
                            sender: newMsg.sender,
                            timestamp: newMsg.timestamp
                        }
                    ]);
                }
            });
            
            return () => {
                socket.off('receiveMessage');
            };
        }
    }, [parsedActivity]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const fetchMessages = async () => {
        if (!parsedActivity || !parsedActivity._id) {
            console.log('No activity ID available for fetching messages');
            return;
        }
        
        try {
            console.log(`Fetching messages for activity: ${parsedActivity._id}`);
            // Use the same URL as socket connection
            const response = await fetch(`${SOCKET_URL}/api/chat/${parsedActivity._id}/messages`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            
            if (response.ok) {
                const fetchedMessages = await response.json();
                console.log(`Received ${fetchedMessages.length} messages from server`);
                setMessages(fetchedMessages.map(msg => ({
                    id: msg._id || msg.id || Date.now().toString(),
                    text: msg.text || msg.message,
                    image: msg.image,
                    sender: msg.sender,
                    timestamp: msg.timestamp
                })));
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch messages:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        // Set quality lower to reduce file size directly when capturing
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2, // Very low quality to ensure small size
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const sendMessage = async () => {
        if ((newMessage.trim() || image) && parsedActivity && parsedActivity._id) {
            const messageId = Date.now().toString();
            let imageData = null;
            
            // If there's an image, process it
            if (image) {
                try {
                    console.log('Processing image for sending...');
                    
                    // Simple approach: just convert to base64
                    const response = await fetch(image);
                    const blob = await response.blob();
                    console.log(`Image size: ${(blob.size / 1024).toFixed(2)} KB`);
                    
                    // Check if image is too large
                    if (blob.size > 1024 * 1024) {
                        Alert.alert('Image too large', 'Please try taking a photo with lower resolution');
                        return;
                    }
                    
                    const reader = new FileReader();
                    imageData = await new Promise((resolve) => {
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                        reader.readAsDataURL(blob);
                    });
                    
                    console.log(`Base64 image size: ${imageData.length} bytes`);
                } catch (error) {
                    console.error('Error processing image:', error);
                    Alert.alert('Error', 'Failed to process image for sending');
                    return;
                }
            }
            
            const messageData = {
                id: messageId,
                text: newMessage.trim(),
                image: imageData, // Now contains base64 data or null
                sender: 'User', 
                timestamp: new Date().toISOString(),
                activityId: parsedActivity._id,
            };
            
            // Add message to local state immediately for UI responsiveness
            setMessages(prevMessages => [...prevMessages, messageData]);
            setNewMessage('');
            setImage(null);
            
            // Only send through the REST API for persistence
            try {
                console.log(`Saving message to activity ${parsedActivity._id} via REST API`);
                const response = await fetch(`${SOCKET_URL}/api/chat/${parsedActivity._id}/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({
                        sender: messageData.sender,
                        text: messageData.text,
                        image: messageData.image
                    }),
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Failed to save message via REST API:', response.status, errorText);
                }
            } catch (error) {
                console.error('Error saving message:', error);
                Alert.alert('Error', 'Failed to send message. Please try again.');
            }
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
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => item.id ? item.id + index : index.toString()}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageContainer,
                        item.sender === 'User' ? styles.userMessage : styles.otherMessage
                    ]}>
                        {item.image && (
                            <Image 
                                source={{ uri: item.image.startsWith('data:') ? item.image : `data:image/jpeg;base64,${item.image}` }} 
                                style={styles.messageImage}
                                resizeMode="cover"
                                onError={(e) => console.log("Image loading error:", e.nativeEvent.error)}
                            />
                        )}
                        {item.text && (
                            <Text style={styles.messageText}>{item.text}</Text>
                        )}
                        <Text style={styles.timestamp}>
                            {new Date(item.timestamp).toLocaleTimeString()}
                        </Text>
                    </View>
                )}
                style={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
                    <FontAwesome name="camera" size={24} color="white" />
                </TouchableOpacity>
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
            {image && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity 
                        style={styles.removeImageButton}
                        onPress={() => setImage(null)}
                    >
                        <FontAwesome name="times" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
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
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5,
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
    cameraButton: {
        backgroundColor: '#007AFF',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreviewContainer: {
        position: 'relative',
        margin: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    removeImageButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#ff4444',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 