import { CheckCircle, XCircle } from 'lucide-react';

export default function MessageBox({ type, message }) {
    if (!message) return null;

    const isSuccess = type === 'success';
    return (
        <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
                isSuccess
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-red-50 border-2 border-red-200'
            }`}
        >
            {isSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
                className={`text-sm font-medium ${
                    isSuccess ? 'text-green-800' : 'text-red-800'
                }`}
            >
                {message}
            </p>
        </div>
    );
}
