export default function SummaryCard({title, value, color, icon: Icon}) {
    return (
        <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${color}-500`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
                </div>
                <Icon className={`w-12 h-12 text-${color}-500`}/>
            </div>
        </div>
    );
}
