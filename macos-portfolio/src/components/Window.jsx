import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const Window = ({ title, id, isOpen, isMin, zIndex, onClose, onFocus, children }) => {
    const nodeRef = useRef(null);

    if (!isOpen) return null;

    return (
        <Draggable
            handle=".window-header"
            nodeRef={nodeRef}
            onStart={onFocus}
            onMouseDown={onFocus} // Also focus on click
        >
            <div
                ref={nodeRef}
                className="absolute top-10 left-10 w-full max-w-2xl bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden border border-gray-700 font-sans"
                style={{ zIndex, display: isMin ? 'none' : 'block' }}
            >
                {/* Header / Traffic Lights */}
                <div className="window-header h-10 bg-[#2a2a2a] flex items-center px-4 cursor-default border-b border-black">
                    <div className="flex space-x-2 group">
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-[8px] text-black opacity-80 hover:opacity-100"
                        >
                        </button>
                        <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 opacity-80 hover:opacity-100"></button>
                        <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 opacity-80 hover:opacity-100"></button>
                    </div>
                    <div className="flex-1 text-center text-gray-400 text-xs font-semibold">{title}</div>
                    <div className="w-16"></div> {/* Spacer for centering */}
                </div>

                {/* Content */}
                <div className="cursor-auto bg-[#1e1e1e] min-h-[400px] text-gray-200 p-4">
                    {children}
                </div>
            </div>
        </Draggable>
    );
};

export default Window;
