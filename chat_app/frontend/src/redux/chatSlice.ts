import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import socket from '../utils/socket';

// Message interface schema
interface Message {
    // id: number;
    senderId: number | null;
    receiverId: number | null;
    content: string | null;
    createdAt?: string | null;
}

// Define the state of the chat
interface ChatState {
    currentUserId: number | null;
    messages: Message[];
}

const initialState: ChatState = {
    currentUserId: null,
    messages: [], // Empty chat
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentUserId: (state, action: PayloadAction<number>) => {
            state.currentUserId = action.payload;
        },
        sendMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            state.messages.push(message);
            // send to backend using socket
            socket.emit(
                'message',
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'sendMessage',
                    params: message,
                    id: new Date().getTime(),
                })
            );
        },
        receiveMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
    },
});

export const { setCurrentUserId, sendMessage, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
