import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useState } from 'react';
import { sendMessage } from '../redux/chatSlice';

const Chat = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state: RootState) => state.chat.messages);
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim() === '') return;
        // Dispatch action to the reducer to send message
        dispatch(sendMessage({ senderId: 1, receiverId: 2, content: message }));
        // Clear text input messaging field
        setMessage('');
    };
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/*Header*/}
            <div className="p-4 text-center bg-gray-800 shadow-lg">
                <h1 className="text-lg font-bold">Real-Time Chatter!</h1>
            </div>
            {/*Message List*/}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 max-w-xs rounded-md ${msg.senderId === 1 ? 'bg-blue-500 ml-auto' : 'bg-gray-700'}`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            {/* Text input */}
            <div className="p-4 flex items-center bg-gray-800">
                <input
                    type="text"
                    className="flex-1 p-2 rounded-md text-black"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
