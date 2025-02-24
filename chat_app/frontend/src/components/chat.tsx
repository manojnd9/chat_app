import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import socket from '../utils/socket';

const Chat = () => {
    // this state would have gotten updated to the selected user's id in the first/home page
    const currentUserId = useSelector((state: RootState) => state.chat.currentUserId);

    // This is initial approach. User data is hard coded
    // Later once the authentication is set up, users can be fetched from db via backend
    const allUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' },
    ];

    // Filter out the currentUser from all the users in order to show them
    // as possible recipients of the message
    const otherUsers = allUsers.filter((user) => user.id !== currentUserId);

    // States and functions to manage the local components on interaction of the
    // user in the UI
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<{ senderId: number; content: string }[]>([]);
    const [input, setInput] = useState('');

    // Connect to websocket on loading
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
            socket.on('connect', () => {
                console.log('Connected to websocket server!');
            });
        }
        // socket.on('connect', () => {
        //     console.log('Connected to websocket server!');
        // });

        return () => {
            // socket.disconnect();
            console.log('Leaving chat. but socket connection is on!');
        };
    });

    // Handler to dispatch the reducer function to send the message to the store upon
    // the action from the user
    const handleSendMessage = () => {
        if (input.trim() !== '' && selectedUserId) {
            setMessages([...messages, { senderId: currentUserId!, content: input }]);
            setInput('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-800 text-white">
            {/* Left Panel to display current user and possible recipients */}
            <div className="w-1/4 bg-gray-900 p-4">
                {/**current user */}
                <h2 className="text-lg font-bold">You: User {currentUserId}</h2>
                {/**Recipients */}
                <ul>
                    {otherUsers.map((user) => (
                        <li
                            key={user.id}
                            className={`cursor-pointer p-2 ${
                                selectedUserId === user.id ? 'bg-blue-500' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setSelectedUserId(user.id)}
                        >
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/** Chat display: when no recipient is selected -> show default message */}
            <div className="flex flex-col flex-1 p-4">
                {selectedUserId ? (
                    <>
                        <h2 className="text-lg font-bold mb-2">Chat with User {selectedUserId}</h2>
                        <div className="flex-1 overflow-y-auto bg-gray-700 p-4 rounded-lg">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 p-2 rounded-lg max-w-xs ${
                                        msg.senderId === currentUserId
                                            ? 'bg-blue-500 text-right ml-auto'
                                            : 'bg-gray-600 text-left'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 p-2 rounded-lg text-black"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={handleSendMessage}
                                className="ml-2 bg-blue-600 px-4 py-2 rounded-lg"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Select a user to start chatting</p>
                )}
            </div>
        </div>
    );
};

export default Chat;
