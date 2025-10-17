import { createContext, useState } from 'react';

// Mocked Users
const users = [
    { user_id: 1, name: 'Collector A', role: 'Collector' },
];

// Mocked Bins
const bins = [
    { bin_id: 'BIN001', resident_id: 101, location: '123 Main St', bin_type: 'General', status: 'Active', qr_code: 'QR001' },
    { bin_id: 'BIN002', resident_id: 102, location: '456 Oak Ave', bin_type: 'Recyclable', status: 'Active', qr_code: 'QR002' },
    { bin_id: 'BIN003', resident_id: 103, location: '789 Pine Rd', bin_type: 'Organic', status: 'Active', qr_code: 'QR003' },
];

// Mocked Routes & Stops
const initialRoutes = [
    {
        route_id: 1,
        dispatcher_id: 201,
        collector_id: 1,
        date: '2025-10-14',
        status: 'Pending',
        stops: [
            { stop_id: 1, bin_id: 'BIN001', stop_order: 1, collected: false, photo_url: '', issue_note: '' },
            { stop_id: 2, bin_id: 'BIN002', stop_order: 2, collected: false, photo_url: '', issue_note: '' },
            { stop_id: 3, bin_id: 'BIN003', stop_order: 3, collected: false, photo_url: '', issue_note: '' },
        ],
    },
];

// Mocked Notifications
const initialNotifications = [
    { notification_id: 1, user_id: 1, type: 'Collection Update', message: 'New route assigned', read_status: false },
];

export const CollectorContext = createContext();

export const CollectorProvider = ({ children }) => {
    const [routes, setRoutes] = useState(initialRoutes);
    const [notifications, setNotifications] = useState(initialNotifications);

    const markCollected = (routeId, binId, weight, photo) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.route_id === routeId) {
                    return {
                        ...route,
                        stops: route.stops.map(stop =>
                            stop.bin_id === binId
                                ? { ...stop, collected: true, weight, photo_url: photo }
                                : stop
                        ),
                    };
                }
                return route;
            })
        );
    };

    const reportIssue = (routeId, binId, issueNote) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.route_id === routeId) {
                    return {
                        ...route,
                        stops: route.stops.map(stop =>
                            stop.bin_id === binId ? { ...stop, issue_note: issueNote } : stop
                        ),
                    };
                }
                return route;
            })
        );
    };

    return (
        <CollectorContext.Provider value={{ routes, markCollected, reportIssue, notifications }}>
            {children}
        </CollectorContext.Provider>
    );
};



// import React, { createContext, useState, useEffect } from "react";
import { getTodaysRoutes, markBinCollected } from "../services/collector/collectorService";

// // Mocked Users
// const users = [
//     { user_id: 1, name: 'Collector A', role: 'Collector' },
// ];
//
// // Mocked Bins
// const bins = [
//     { bin_id: 'BIN001', resident_id: 101, location: '123 Main St', bin_type: 'General', status: 'Active', qr_code: 'QR001' },
//     { bin_id: 'BIN002', resident_id: 102, location: '456 Oak Ave', bin_type: 'Recyclable', status: 'Active', qr_code: 'QR002' },
//     { bin_id: 'BIN003', resident_id: 103, location: '789 Pine Rd', bin_type: 'Organic', status: 'Active', qr_code: 'QR003' },
// ];
//
// // Mocked Routes & Stops
// const initialRoutes = [
//     {
//         route_id: 1,
//         dispatcher_id: 201,
//         collector_id: 1,
//         date: '2025-10-14',
//         status: 'Pending',
//         stops: [
//             { stop_id: 1, bin_id: 'BIN001', stop_order: 1, collected: false, photo_url: '', issue_note: '' },
//             { stop_id: 2, bin_id: 'BIN002', stop_order: 2, collected: false, photo_url: '', issue_note: '' },
//             { stop_id: 3, bin_id: 'BIN003', stop_order: 3, collected: false, photo_url: '', issue_note: '' },
//         ],
//     },
// ];
//
// // Mocked Notifications
// const initialNotifications = [
//     { notification_id: 1, user_id: 1, type: 'Collection Update', message: 'New route assigned', read_status: false },
// ];


//
// export const CollectorContext = createContext();
//
// export const CollectorProvider = ({ children }) => {
//     const [routes, setRoutes] = useState([]);
//     const collectorId = 2; // Change this to logged-in collector ID
//
//     useEffect(() => {
//         const fetchRoutes = async () => {
//             try {
//                 const data = await getTodaysRoutes(collectorId);
//                 setRoutes(data);
//             } catch (err) {
//                 console.error("Failed to load routes", err);
//             }
//         };
//         fetchRoutes();
//     }, [collectorId]);
//
//     const markCollected = async (stopId, weight) => {
//         try {
//             const updatedStop = await markBinCollected(stopId, weight);
//             setRoutes((prevRoutes) =>
//                 prevRoutes.map((route) => ({
//                     ...route,
//                     stops: route.stops.map((stop) =>
//                         stop.id === stopId ? updatedStop : stop
//                     ),
//                 }))
//             );
//         } catch (err) {
//             console.error("Failed to mark collected", err);
//         }
//     };
//
//     return (
//         <CollectorContext.Provider value={{ routes, markCollected }}>
//             {children}
//         </CollectorContext.Provider>
//     );
// };
