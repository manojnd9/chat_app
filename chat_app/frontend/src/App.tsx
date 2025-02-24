import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from './redux/chatSlice';
import { RootState } from './redux/store';

function App() {
    const messages = useSelector((state: RootState) => state.chat.messages);
    const dispatch = useDispatch();

    const sendMessage = () => {
        dispatch(
            addMessage({
                id: messages.length + 1,
                senderId: 1,
                receiverId: 2,
                content: 'Hello from redux app!',
                createdAt: new Date().toISOString(),
            })
        );
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-4">Chat App 0.1</h1>
            <button onClick={sendMessage} className="bg-blue-500 px-4 py-2 rounded-md text-white">
                Send Message
            </button>

            <div className="mt-4">
                {messages.map((msg) => (
                    <p key={msg.id} className="bg-gray-700 p-2 rounded mt-2">
                        {msg.content}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default App;
