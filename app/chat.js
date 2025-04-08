import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ChatScreen() {
    const router = useRouter();
    const { activity } = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [parsedActivity, setParsedActivity] = useState(null);
    const [image, setImage] = useState(null);

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

    const pickImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const sendMessage = () => {
        if ((newMessage.trim() || image) && parsedActivity) {
            const message = {
                id: Date.now().toString(),
                text: newMessage,
                image: image,
                sender: 'User', 
                timestamp: new Date().toISOString(),
                activityId: parsedActivity._id,
            };
            setMessages([...messages, message]);
            setNewMessage('');
            setImage(null);
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
                        {item.image && (
                            <Image 
                                source={{ uri: item.image }} 
                                style={styles.messageImage}
                                resizeMode="cover"
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