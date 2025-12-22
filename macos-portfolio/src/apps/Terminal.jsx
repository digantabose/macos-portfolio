import React, { useState, useEffect } from 'react';

const Terminal = () => {
    const [lines, setLines] = useState([
        "Welcome to MyPortfolio v1.0.0",
        "Type 'help' to see available commands.",
    ]);
    const [input, setInput] = useState('');

    const commands = {
        help: "Available commands: about, skills, projects, contact, clear",
        about: "I am a Full Stack Developer passionate about building things.",
        skills: "React, GSAP, Tailwind, Node.js, Python...",
        projects: "Check out the 'Safari' app to see my work!",
        contact: "Email me at: example@email.com",
        clear: "CLEAR",
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            let response = `> ${input}`;

            if (cmd === 'clear') {
                setLines([]);
            } else if (commands[cmd]) {
                setLines((prev) => [...prev, response, commands[cmd]]);
            } else if (cmd) {
                setLines((prev) => [...prev, response, `Command not found: ${cmd}`]);
            } else {
                setLines((prev) => [...prev, response]);
            }

            setInput('');
        }
    };

    return (
        <div className="font-mono text-sm h-full flex flex-col text-green-400">
            <div className="flex-1 overflow-y-auto space-y-1">
                {lines.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
            <div className="flex mt-2">
                <span className="mr-2 text-blue-400">~ user$</span>
                <input
                    autoFocus
                    className="bg-transparent outline-none flex-1 text-green-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

export default Terminal;
