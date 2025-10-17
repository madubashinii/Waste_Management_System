import {NavLink} from 'react-router-dom';
import {LayoutDashboard, MapPin, AlertCircle, FileText, Trash2, Menu, X} from 'lucide-react';
import {useState} from 'react';

export default function CollectorSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        {to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard},
        {to: 'routes', label: "Today's Routes", icon: MapPin},
        {to: 'report', label: 'Report Issue', icon: AlertCircle},
        {to: 'summary', label: 'Route Summary', icon: FileText},
        {to: 'collect', label: 'Bin Collection', icon: Trash2}
    ];

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-colors"
            >
                {isOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 
                shadow-2xl transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header */}
                <div className="p-6 border-b border-emerald-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Eco Collector</h2>
                            <p className="text-xs text-emerald-300">Waste Management</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        className={({isActive}) => `
                                            flex items-center gap-3 px-4 py-3 rounded-lg 
                                            transition-all duration-200 group
                                            ${isActive
                                            ? 'bg-emerald-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-emerald-700/50 hover:text-white'
                                        }
                                        `}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {({isActive}) => (
                                            <>
                                                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                                                    isActive ? 'text-white' : 'text-emerald-400'
                                                }`}/>
                                                <span className="font-medium">{item.label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-700">
                    <div className="bg-emerald-700/50 rounded-lg p-3">
                        <p className="text-xs text-emerald-200 font-medium">Collector Portal</p>
                        <p className="text-xs text-emerald-300 mt-1">Version 1.0</p>
                    </div>
                </div>
            </div>
        </>
    );
}