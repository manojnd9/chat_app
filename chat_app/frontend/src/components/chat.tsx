import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import socket from '../utils/socket';
import { fetchMessages, receiveMessage, sendMessage } from '../redux/chatSlice';
import { Canvas } from '@react-three/fiber';
import ThreeDIcon from './threeDIcon';

/** Contains all the components to render chat page.
 * - It renders:
 *      - current user
 *      - list of users to send message in the left panel
 *      - message display area
 *      - input field and send button
 *      - canvas to render rotating tetrahedron animation for 2s after message is sent
 * - Above rendering and data management is done using...
 *      - redux hooks call
 *      - local state management
 *      - dummy users mapping
 *      - current user and selected receiver management
 */
const Chat = () => {
    // Set up redux hooks
    const dispatch = useAppDispatch();
    // this state would have gotten updated to the selected user's id in the first/home page
    const currentUserId = useSelector((state: RootState) => state.chat.currentUserId);
    const messages = useSelector((state: RootState) => state.chat.messages);

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
    const [input, setInput] = useState('');

    // Connect to websocket on loading
    useEffect(() => {
        // First connect to the server
        if (!socket.connected) {
            socket.connect();
            socket.on('connect', () => {
                console.log('Connected to websocket server!');
            });
        }

        // Inform backend to make user join chat room
        // using once -> join only one time
        socket.once('connect', () => {
            socket.emit(
                'message',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'join',
                    params: { user_id: currentUserId },
                    id: new Date().getTime(),
                })
            );
        });

        // Listen for incoming messages
        const handlerIncomingMessage = (data: any) => {
            try {
                if (data.jsonrpc === '2.0' && data.params) {
                    dispatch(receiveMessage(data.params));
                }
            } catch (e) {
                console.error('Error parsing received message!', e);
            }
        };
        socket.off('newMessage');
        socket.on('newMessage', handlerIncomingMessage);

        return () => {
            socket.off('newMessage', handlerIncomingMessage);
        };
    }, [currentUserId, dispatch]);

    // Load message history between sender and receiver
    useEffect(() => {
        if (selectedUserId) {
            dispatch(fetchMessages({ senderId: currentUserId, receiverId: selectedUserId }));
        }
    }, [selectedUserId, dispatch, currentUserId]);

    // 3D Animation Canvas Set-up
    const [showIcon, setShowIcon] = useState(false);

    // Handler to dispatch the reducer function to send the message to the store upon
    // the action from the user
    const handleSendMessage = () => {
        if (input.trim() !== '' && selectedUserId) {
            const message = {
                senderId: currentUserId,
                receiverId: selectedUserId,
                content: input,
            };
            if (!socket.connected) {
                // Show warning
                console.log('no connection to server!');
            }
            dispatch(sendMessage(message));
            setInput('');
            // Render animation for 1second anf then hide
            setShowIcon(true);
            /* eslint-disable */
            setTimeout(() => setShowIcon(false), 2000);
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

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Canvas style={{ width: '40%', height: '40%', position: 'absolute' }}>
                                <ambientLight intensity={Math.PI / 2} />
                                <spotLight
                                    position={[10, 10, 10]}
                                    angle={0.15}
                                    penumbra={1}
                                    decay={0}
                                    intensity={Math.PI}
                                />
                                <pointLight
                                    position={[-10, -10, -10]}
                                    decay={0}
                                    intensity={Math.PI}
                                />
                                <ThreeDIcon visible={showIcon} />
                            </Canvas>
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
                    <p>Select a user to start chatting!</p>
                )}
            </div>
        </div>
    );
};

export default Chat;
