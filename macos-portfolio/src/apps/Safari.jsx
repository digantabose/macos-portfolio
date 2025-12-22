import React from 'react';

const projects = [
    { title: 'Project Alpha', desc: 'A cool React application.', color: 'bg-blue-500' },
    { title: 'Project Beta', desc: 'Next.js and Tailwind goodness.', color: 'bg-purple-500' },
    { title: 'Project Gamma', desc: 'Three.js 3D experiments.', color: 'bg-orange-500' },
];

const Safari = () => {
    return (
        <div className="h-full flex flex-col bg-white text-black -m-4">
            {/* Browser Toolbar */}
            <div className="h-10 bg-gray-100 border-b flex items-center px-4 space-x-4">
                <div className="flex space-x-2 text-gray-400">
                    <span>{'<'}</span>
                    <span>{'>'}</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded text-center text-sm py-1 text-gray-600">
                    mysite.com/projects
                </div>
                <div>R</div>
            </div>

            {/* Content */}
            <div className="p-8 bg-gray-50 flex-1 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-6">My Projects</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {projects.map((p, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border">
                            <div className={`h-32 ${p.color} w-full`}></div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                                <p className="text-gray-600">{p.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Safari;
