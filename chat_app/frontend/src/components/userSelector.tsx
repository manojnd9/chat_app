import React from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUserId } from '../redux/chatSlice';
import { useNavigate } from 'react-router-dom';

const SelectUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // This is for initial steps... later, authentication can be set up
    // and data can be fetched from backend and be shown here....
    const users = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' },
    ];

    const handleSelectUser = (id: number) => {
        // set the value of current user as the selected ones and
        // dispatch the reducer function to update in the store
        dispatch(setCurrentUserId(id));
        // Redirect to chat page
        navigate('/chat');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h2 className="text-xl font-bold mb-4">User Selection: Select Who You Are!</h2>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="cursor-pointer p-2 bg-gray-700 hover:bg-blue-500 rounded-md"
                        onClick={() => handleSelectUser(user.id)}
                    >
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SelectUser;
