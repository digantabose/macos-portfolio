import React, { useRef } from 'react';
import { FaTerminal, FaSafari, FaCog, FaGithub, FaEnvelope } from 'react-icons/fa';

const apps = [
    { id: 'terminal', icon: FaTerminal, color: 'text-gray-300' },
    { id: 'safari', icon: FaSafari, color: 'text-blue-500' },
    { id: 'settings', icon: FaCog, color: 'text-gray-400' },
    { id: 'github', icon: FaGithub, color: 'text-white', link: 'https://github.com' },
    { id: 'mail', icon: FaEnvelope, color: 'text-blue-400', link: 'mailto:user@example.com' },
];

const Dock = ({ openApp }) => {
    const dockRef = useRef(null);

    const handleMouseMove = (e) => {
        // Simple scaling logic could go here or use GSAP
        // For now, we will rely on CSS hover standard transform for simplicity and stability
        // implementing full "fisheye" locally is complex to get perfect without a library like `react-use-gesture` or fine-tuned GSAP
    };

    return (
        <div className="flex justify-center mb-4 relative z-50">
            <div
                className="flex items-end space-x-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-xl p-2 rounded-2xl border border-white border-opacity-10 shadow-2xl"
                ref={dockRef}
            >
                {apps.map((app) => (
                    <button
                        key={app.id}
                        onClick={() => {
                            if (app.link) {
                                window.open(app.link, '_blank');
                            } else {
                                openApp(app.id);
                            }
                        }}
                        className="group relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:w-16 hover:h-16 hover:-translate-y-4 rounded-xl bg-[#232323] shadow-lg border border-white border-opacity-5 hover:bg-[#333]"
                        title={app.id.charAt(0).toUpperCase() + app.id.slice(1)}
                    >
                        <app.icon className={`w-3/4 h-3/4 ${app.color}`} />
                        {/* Dot indicator (optional) */}
                        <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dock;
