export const getTodaysRoutes = async () => {
    return [
        {
            id: 1,
            routeName: 'Route A',
            zone: 'Zone 1',
            date: '2025-10-15',
            status: 'Pending',
            bins: [
                { id: 101, location: 'Street 1', status: 'Pending', order: 1 },
                { id: 102, location: 'Street 2', status: 'Pending', order: 2 }
            ]
        },
        {
            id: 2,
            routeName: 'Route B',
            zone: 'Zone 2',
            date: '2025-10-15',
            status: 'Pending',
            bins: [
                { id: 201, location: 'Street 3', status: 'Pending', order: 1 },
                { id: 202, location: 'Street 4', status: 'Pending', order: 2 }
            ]
        }
    ];
};

export const markBinCollected = async (binId) => {
    return { success: true, binId };
};

export const reportIssue = async (data) => {
    return { success: true, ...data };
};

export const getRouteSummary = async () => {
    return { totalRoutes: 2, binsCollected: 1, missed: 1, overflow: 0 };
};

//
// import API_BASE_URL from "../api"
// import axios from 'axios';
//
// export const getTodaysRoutes = async (collectorId) => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/collector/routes`, {
//             params: { collectorId },
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching routes:", error);
//         throw error;
//     }
// };
//
// export const markBinCollected = async (stopId, collectedWeight) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/collector/route-stops/${stopId}/collect`, {
//             collectedWeight,
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error marking bin collected:", error);
//         throw error;
//     }
// };
