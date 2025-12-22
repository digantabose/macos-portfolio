import React, { useState } from 'react';
import MenuBar from './MenuBar';
import Dock from './Dock';
import Window from './Window';
import Terminal from '../apps/Terminal';
import Safari from '../apps/Safari';
import Settings from '../apps/Settings';

const Desktop = () => {
    const [windows, setWindows] = useState({
        terminal: { isOpen: true, isMin: false, z: 1 },
        safari: { isOpen: false, isMin: false, z: 0 },
        settings: { isOpen: false, isMin: false, z: 0 },
    });

    const [activeApp, setActiveApp] = useState('Terminal');
    const [zIndexCounter, setZIndexCounter] = useState(2);

    const openApp = (appKey) => {
        setWindows((prev) => ({
            ...prev,
            [appKey]: { ...prev[appKey], isOpen: true, isMin: false, z: zIndexCounter },
        }));
        setZIndexCounter(z => z + 1);
        setActiveApp(appKey.charAt(0).toUpperCase() + appKey.slice(1));
    };

    const closeApp = (appKey) => {
        setWindows((prev) => ({
            ...prev,
            [appKey]: { ...prev[appKey], isOpen: false },
        }));
    };

    const focusApp = (appKey) => {
        setWindows((prev) => ({
            ...prev,
            [appKey]: { ...prev[appKey], z: zIndexCounter },
        }));
        setZIndexCounter(z => z + 1);
        setActiveApp(appKey.charAt(0).toUpperCase() + appKey.slice(1));
    };

    return (
        <div
            className="h-full w-full bg-center bg-cover relative flex flex-col justify-between"
            style={{
                backgroundImage: 'url("https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2560x1440-1455.jpg")'
            }}
        >
            <MenuBar activeApp={activeApp} />

            <div className="flex-1 relative z-0">
                {windows.terminal.isOpen && (
                    <Window
                        title="Terminal"
                        id="terminal"
                        isOpen={windows.terminal.isOpen}
                        isMin={windows.terminal.isMin}
                        zIndex={windows.terminal.z}
                        onClose={() => closeApp('terminal')}
                        onFocus={() => focusApp('terminal')}
                    >
                        <Terminal />
                    </Window>
                )}

                {windows.safari.isOpen && (
                    <Window
                        title="Safari"
                        id="safari"
                        isOpen={windows.safari.isOpen}
                        isMin={windows.safari.isMin}
                        zIndex={windows.safari.z}
                        onClose={() => closeApp('safari')}
                        onFocus={() => focusApp('safari')}
                    >
                        <Safari />
                    </Window>
                )}

                {windows.settings.isOpen && (
                    <Window
                        title="Settings"
                        id="settings"
                        isOpen={windows.settings.isOpen}
                        isMin={windows.settings.isMin}
                        zIndex={windows.settings.z}
                        onClose={() => closeApp('settings')}
                        onFocus={() => focusApp('settings')}
                    >
                        <Settings />
                    </Window>
                )}
            </div>

            <Dock openApp={openApp} />
        </div>
    );
};

export default Desktop;
