import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
            state.messages.push(action.payload);
        },
    },
});

export const { setCurrentUserId, sendMessage } = chatSlice.actions;
export default chatSlice.reducer;
