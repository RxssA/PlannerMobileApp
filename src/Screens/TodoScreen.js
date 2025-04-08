import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../Api';

const TodoScreen = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await getTodos();
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleAddTodo = async () => {
        if (!newTodo.trim()) return;

        try {
            const response = await createTodo({
                title: newTodo,
                description: '',
                completed: false,
                dueDate: new Date()
            });
            setTodos([...todos, response.data]);
            setNewTodo('');
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    };

    const handleToggleComplete = async (todo) => {
        try {
            const response = await updateTodo(todo._id, {
                ...todo,
                completed: !todo.completed
            });
            setTodos(todos.map(t => t._id === todo._id ? response.data : t));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            await deleteTodo(todoId);
            setTodos(todos.filter(t => t._id !== todoId));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newTodo}
                    onChangeText={setNewTodo}
                    placeholder="Add a new todo"
                    onSubmitEditing={handleAddTodo}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={todos}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <TouchableOpacity
                            style={styles.todoContent}
                            onPress={() => handleToggleComplete(item)}
                        >
                            <View style={[
                                styles.checkbox,
                                item.completed && styles.checkboxCompleted
                            ]} />
                            <Text style={[
                                styles.todoText,
                                item.completed && styles.todoTextCompleted
                            ]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTodo(item._id)}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginRight: 10
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center'
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        marginBottom: 10
    },
    todoContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007bff',
        marginRight: 10
    },
    checkboxCompleted: {
        backgroundColor: '#007bff'
    },
    todoText: {
        flex: 1,
        fontSize: 16
    },
    todoTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#888'
    },
    deleteButton: {
        padding: 10
    },
    deleteButtonText: {
        color: '#dc3545'
    }
});

export default TodoScreen; 