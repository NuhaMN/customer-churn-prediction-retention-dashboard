export default function LiveActivity() {
    const activities = [
        {
            event: "High-risk customer detected",
            time: "2 mins ago",
            color: "bg-red-500",
        },
        {
            event: "Recommendation generated",
            time: "10 mins ago",
            color: "bg-cyan-500",
        },
        {
            event: "Revenue impact updated",
            time: "25 mins ago",
            color: "bg-purple-500",
        },
        {
            event: "Profile analyzed",
            time: "42 mins ago",
            color: "bg-emerald-500",
        },
    ];

    return (
        <div className="glass-card p-4 text-white">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">
                    Live Activity
                </h2>

                <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                    Live
                </span>
            </div>

            <div className="space-y-2">
                {activities.map((activity, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2"
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${activity.color}`}
                        />

                        <div className="flex-1 flex justify-between items-center">
                            <p className="text-xs text-white">
                                {activity.event}
                            </p>

                            <span className="text-[10px] text-gray-400">
                                {activity.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-2 border-t border-white/10">
                <p className="text-xs text-gray-400">
                    Monitoring churn predictions in real time.
                </p>
            </div>
        </div>
    );
}