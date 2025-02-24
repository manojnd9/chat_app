import { createSlice } from '@reduxjs/toolkit';

// Message interface schema
interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: string;
}

// Define the state of the chat
interface ChatState {
    messages: Message[];
}

const initialState: ChatState = {
    messages: [], // Empty chat
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        sendMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
});

export const { sendMessage } = chatSlice.actions;
export default chatSlice.reducer;
