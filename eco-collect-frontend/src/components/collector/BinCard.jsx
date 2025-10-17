import {CheckCircle, Clock, MapPin, Weight, Camera} from "lucide-react";
import {useState, useContext} from "react";
import {CollectorContext} from "../../context/CollectorContext";

export default function BinCard({stop, index, routeId}) {
    const {markCollected, reportIssue} = useContext(CollectorContext);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleCollect = async () => {
        const weight = prompt("Enter weight collected (kg):", stop.weight || "0");
        if (weight !== null) {
            await markCollected({binId: stop.binId, routeId, weight: parseFloat(weight)});
        }
    };

    const handleReportIssue = async (type) => {
        const note = prompt(`Report issue (${type}):`, type);
        if (note) {
            await reportIssue(routeId, stop.binId, note);
        }
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
                stop.collected ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'
            }`}
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            stop.collected ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                            {index + 1}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{stop.binId}</h3>
                                {stop.collected ? (
                                    <span
                                        className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4"/> Collected
                                    </span>
                                ) : (
                                    <span
                                        className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                        <Clock className="w-4 h-4"/> Pending
                                    </span>
                                )}
                            </div>
                            {stop.location && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <MapPin className="w-4 h-4"/>
                                    <span>{stop.location}</span>
                                </div>
                            )}
                            {stop.timestamp && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Collected at: {stop.timestamp}
                                </p>
                            )}
                            {stop.issueReported && stop.issue && (
                                <p className="text-sm text-red-600 mt-1">Issue: {stop.issue}</p>
                            )}
                        </div>
                    </div>

                    {!stop.collected && (
                        <div className="flex flex-col gap-2 ml-4">
                            <button
                                onClick={handleCollect}
                                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-semibold"
                            >
                                Mark Collected
                            </button>
                            <button
                                onClick={() => handleReportIssue('MISSED')}
                                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-semibold"
                            >
                                Report Issue
                            </button>
                        </div>
                    )}
                </div>

                {stop.collected && (
                    <div className="border-t pt-4 mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {stop.weight && (
                                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <Weight className="w-6 h-6 text-purple-600"/>
                                        <div>
                                            <p className="text-sm text-gray-600">Weight Collected</p>
                                            <p className="text-2xl font-bold text-purple-600">{stop.weight} kg</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {stop.photo_url && (
                                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Camera className="w-6 h-6 text-blue-600"/>
                                        <div>
                                            <p className="text-sm text-gray-600">Photo Evidence</p>
                                            <p className="text-xs text-blue-600 font-semibold">Click to view full
                                                size</p>
                                        </div>
                                    </div>
                                    <img
                                        src={stop.photo_url}
                                        alt={`Proof for ${stop.binId}`}
                                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setSelectedImage(stop.photo_url)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold"
                        >
                            ✕ Close
                        </button>
                        <img src={selectedImage} alt="Full size proof" className="w-full h-auto rounded-lg shadow-2xl"/>
                    </div>
                </div>
            )}
        </div>
    );
}