import {Trash2, FileText, Send} from 'lucide-react';
import MessageBox from './MessageBox';

const issueTypes = [
    {value: 'damaged', label: 'Damaged Bin', icon: '🔨'},
    {value: 'overflow', label: 'Overflow', icon: '📦'},
    {value: 'blocked', label: 'Blocked Access', icon: '🚧'},
    {value: 'missing', label: 'Missing Bin', icon: '❓'},
    {value: 'contamination', label: 'Contamination', icon: '⚠️'},
    {value: 'other', label: 'Other', icon: '📝'},
];

export default function ReportIssueForm({
                                            binId,
                                            issueType,
                                            note,
                                            msg,
                                            msgType,
                                            setBinId,
                                            setIssueType,
                                            setNote,
                                            onSubmit,
                                        }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-6">
                {/* Bin ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bin ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Bin ID (e.g., BIN-001)"
                            value={binId}
                            onChange={(e) => setBinId(e.target.value.toUpperCase())}
                            className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        />
                        <Trash2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"/>
                    </div>
                </div>

                {/* Issue Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Issue Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {issueTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setIssueType(type.value)}
                                disabled={!binId}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    issueType === type.value
                                        ? 'border-orange-500 bg-orange-50 shadow-md'
                                        : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{type.icon}</span>
                                    <span
                                        className={`font-medium text-sm ${
                                            issueType === type.value
                                                ? 'text-orange-700'
                                                : 'text-gray-700'
                                        }`}
                                    >
                    {type.label}
                  </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Issue Description <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
            <textarea
                placeholder="Describe the issue..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="6"
                maxLength="500"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
            />
                        <FileText className="absolute right-4 top-4 w-5 h-5 text-gray-400"/>
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">{note.length}/500</p>
                </div>

                {/* Submit */}
                <button
                    onClick={onSubmit}
                    disabled={!binId || !issueType || !note}
                    className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Send className="w-5 h-5"/>
                    Submit Issue Report
                </button>

                <MessageBox type={msgType} message={msg}/>
            </div>
        </div>
    );
}