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
    messages: Message[];
}

const initialState: ChatState = {
    messages: [], // Empty chat
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
    },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
