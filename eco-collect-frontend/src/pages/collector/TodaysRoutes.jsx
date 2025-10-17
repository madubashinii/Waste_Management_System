import { useContext, useState } from 'react';
import { CollectorContext } from '../../context/CollectorContext';
import { MapPin, Trash2, Camera, Weight, CheckCircle, Clock, Upload, AlertCircle, Route } from 'lucide-react';

export default function TodaysRoutes() {
    const { routes, markCollected } = useContext(CollectorContext);
    const [scanBin, setScanBin] = useState('');
    const [weight, setWeight] = useState('');
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const route = routes[0];

    const handleCollect = () => {
        const stop = route.stops.find(s => s.bin_id === scanBin);
        if (!stop) {
            setMessage('Bin not found! Please check the ID or use manual verification.');
            setMessageType('error');
            return;
        }
        if (stop.collected) {
            setMessage(`Bin ${scanBin} has already been collected!`);
            setMessageType('warning');
            return;
        }
        markCollected(route.route_id, scanBin, weight, photo ? URL.createObjectURL(photo) : '');
        setMessage(`Bin ${scanBin} collected successfully!`);
        setMessageType('success');
        setScanBin('');
        setWeight('');
        setPhoto(null);
    };

    const completedStops = route.stops.filter(s => s.collected).length;
    const totalStops = route.stops.length;
    const progress = (completedStops / totalStops) * 100;

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Route className="w-8 h-8 text-emerald-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Today's Route</h2>
                    </div>
                    <p className="text-gray-600">Route Date: {new Date(route.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                {/* Progress Overview */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Route Progress</h3>
                            <p className="text-sm text-gray-600">{completedStops} of {totalStops} bins collected</p>
                        </div>
                        <div className="text-3xl font-bold text-emerald-600">
                            {Math.round(progress)}%
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end"
                            style={{ width: `${progress}%` }}
                        >
                            {progress > 10 && (
                                <span className="text-xs text-white font-semibold mr-2">{Math.round(progress)}%</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Stops List */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin className="w-6 h-6 text-emerald-600" />
                            <h3 className="text-xl font-bold text-gray-900">Collection Stops</h3>
                        </div>

                        <ul className="space-y-3">
                            {route.stops.map(stop => (
                                <li
                                    key={stop.stop_id}
                                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                                        stop.collected
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-white border-gray-200 hover:border-emerald-300'
                                    }`}
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        stop.collected
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {stop.stop_order}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-gray-900">{stop.bin_id}</p>
                                            {stop.collected ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        {stop.location && <p className="text-sm text-gray-600">{stop.location}</p>}
                                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                            stop.collected
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {stop.collected ? 'Collected ✅' : 'Pending ⏳'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Collection Form */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Trash2 className="w-6 h-6 text-emerald-600" />
                            <h3 className="text-xl font-bold text-gray-900">Mark Bin as Collected</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Bin ID Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Bin ID <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter or scan Bin ID"
                                        value={scanBin}
                                        onChange={e => setScanBin(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                                    />
                                    <Trash2 className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Example: BIN-001, BIN-002, etc.</p>
                            </div>

                            {/* Weight Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Weight (kg) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Enter weight in kg"
                                        value={weight}
                                        onChange={e => setWeight(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                                        min="0"
                                        step="0.1"
                                    />
                                    <Weight className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Photo Evidence
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setPhoto(e.target.files[0])}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        {photo ? (
                                            <div className="flex items-center justify-center gap-2 text-emerald-600">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="font-medium">{photo.name}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">Click to upload photo</p>
                                                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleCollect}
                                disabled={!scanBin || !weight}
                                className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Upload className="w-5 h-5" />
                                Mark as Collected
                            </button>

                            {/* Message Display */}
                            {message && (
                                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                                    messageType === 'success'
                                        ? 'bg-green-50 border-2 border-green-200'
                                        : messageType === 'error'
                                            ? 'bg-red-50 border-2 border-red-200'
                                            : 'bg-yellow-50 border-2 border-yellow-200'
                                }`}>
                                    {messageType === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                                    {messageType === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                                    {messageType === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
                                    <p className={`text-sm font-medium ${
                                        messageType === 'success'
                                            ? 'text-green-800'
                                            : messageType === 'error'
                                                ? 'text-red-800'
                                                : 'text-yellow-800'
                                    }`}>
                                        {message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
