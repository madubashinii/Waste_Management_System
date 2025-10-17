import {createContext, useEffect, useState} from "react";
import {
    getTodayRoutes,
    getNotifications,
    markBinCollected,
    reportBinIssue,
} from "../services/collector/collectorService";

export const CollectorContext = createContext();

export const CollectorProvider = ({children}) => {
    const [routes, setRoutes] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [collectorId, setCollectorId] = useState(null);

    // === Load collector ID from localStorage ===
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.role?.toLowerCase() === "collector") {
                setCollectorId(parsed.userId);
            }
        }
    }, []);

    // === Fetch today's routes ===
    const fetchTodayRoute = async () => {
        if (!collectorId) return;
        try {
            const data = await getTodayRoutes(collectorId);

            // Match backend response shape exactly
            const formatted = data.map(r => ({
                routeId: r.routeId || r.route_id,
                routeName: r.routeName || r.route_name,
                zoneName: r.zoneName || r.zone_name || (r.zone && r.zone.zoneName),
                status: r.status,
                collectionDate: r.collectionDate || r.collection_date,
                stops: (r.stops || []).map(s => ({
                    stopId: s.stopId || s.stop_id,
                    binId: s.binId || s.bin_id,
                    stopOrder: s.stopOrder || s.stop_order,
                    collected: s.collected ?? false,
                    location: s.location || null,
                    issue: s.issue || s.remarks || "",
                })),
            }));


            setRoutes(formatted);
            console.log("Loaded routes:", formatted);
        } catch (err) {
            console.error("Error fetching routes:", err);
        }
    };

    // === Fetch notifications ===
    const fetchNotifications = async () => {
        if (!collectorId) return;
        try {
            const data = await getNotifications(collectorId);
            setNotifications(data);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };


    // === Mark bin collected ===
    const markCollected = async ({binId, routeId, weight}) => {
        if (!collectorId) return;
        const success = await markBinCollected({binId, routeId, collectorId, weight});
        if (success) await fetchTodayRoute();
    };

    // === Report bin issue ===
    const reportIssue = async (routeId, binId, note) => {
        if (!collectorId) return;
        const success = await reportBinIssue({routeId, binId, collectorId, note});
        if (success) await fetchTodayRoute();
    };

    //  Auto-fetch when collectorId becomes available ===
    useEffect(() => {
        if (collectorId) {
            fetchTodayRoute();
            fetchNotifications();
        }
    }, [collectorId]);

    return (
        <CollectorContext.Provider
            value={{
                routes,
                setRoutes,
                notifications,
                setNotifications,
                fetchTodayRoute,
                fetchNotifications,
                markCollected,
                reportIssue,
                collectorId
            }}
        >
            {children}
        </CollectorContext.Provider>
    );
};