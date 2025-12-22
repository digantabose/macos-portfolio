import React from 'react';

const Settings = () => {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">System Preferences</h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <div className="w-10 h-6 bg-green-500 rounded-full cursor-pointer relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span>Bluetooth</span>
                    <span className="text-gray-500">On</span>
                </div>

                <div className="flex items-center justify-between">
                    <span>Wifi</span>
                    <span className="text-gray-500">Connected</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;
