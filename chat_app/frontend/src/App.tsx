import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelectUser from './components/userSelector';
import Chat from './components/chat';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

function App() {
    const currentUserId = useSelector((state: RootState) => state.chat.currentUserId);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<SelectUser />} />
                {currentUserId && <Route path="/chat" element={<Chat />} />}
            </Routes>
        </Router>
    );
}

export default App;
