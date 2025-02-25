import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import socket from '../utils/socket';
import axios from 'axios';

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

// Async function to get message history
const url = 'http://localhost:3000';
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async ({ senderId, receiverId }: { senderId: number | null; receiverId: number | null }) => {
        const res = await axios.get(
            `${url}/messages/getmessages/?senderId=${senderId}&receiverId=${receiverId}`
        );
        return res.data;
    }
);

/** Slice to manage the chat redux state with following reducers
 * to modify and update current state of the app.
 *  - setCurrentUserId: as soon as user is selected in home window,
 *      corresponding user id is stored in the state.
 *  - sendMessage: emits message to backend using socket.io and updates current messages state
 *  - receiveMessage: when socket listens for incoming message this function is used to update message state
 *  - extraReducers: using fetchMessages async thunk, message history from backed is fetched using axios rest api call/
 */
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
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
        });
    },
});

export const { setCurrentUserId, sendMessage, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
