import React, { useState, useEffect } from 'react';
import { FaApple } from 'react-icons/fa';
import { format } from 'date-fns';

const MenuBar = ({ activeApp }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-8 bg-gray-400 bg-opacity-20 backdrop-filter backdrop-blur-md flex items-center justify-between px-4 text-white text-sm relative z-50 shadow-sm">
            <div className="flex items-center space-x-4">
                <FaApple className="text-base" />
                <span className="font-bold">{activeApp}</span>
                <span className="hidden sm:inline">File</span>
                <span className="hidden sm:inline">Edit</span>
                <span className="hidden sm:inline">View</span>
                <span className="hidden sm:inline">Go</span>
                <span className="hidden sm:inline">Window</span>
                <span className="hidden sm:inline">Help</span>
            </div>
            <div className="flex items-center space-x-4">
                <span>{format(time, 'EEE MMM d h:mm aa')}</span>
            </div>
        </div>
    );
};

export default MenuBar;
