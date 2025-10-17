import API from "../api";

// === Fetch today's routes ===
export const getTodayRoutes = async (collectorId) => {
    try {
        const res = await API.get(`/collector/${collectorId}/routes/today`);
        console.log("API /routes/today response:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error in getTodayRoutes:", err);
        return [];
    }
};

// === Fetch notifications ===
export const getNotifications = async (collectorId) => {
    try {
        const res = await API.get(`/collector/${collectorId}/notifications`);
        console.log("API /notifications response:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error in getNotifications:", err);
        return [];
    }
};

// === Mark bin collected ===
export const markBinCollected = async ({binId, routeId, collectorId, weight}) => {
    try {
        const res = await API.post(`/collector/collections/mark`, {
            binId,
            routeId,
            collectorId,
            weight,
            status: "COLLECTED",
        });
        console.log("markBinCollected success:", res.data);
        return true;
    } catch (err) {
        console.error("Error in markBinCollected:", err);
        return false;
    }
};

// === Report bin issue ===
export const reportBinIssue = async ({routeId, binId, collectorId, note}) => {
    try {
        const res = await API.post(`/collector/collections/report-issue`, {
            routeId,
            binId,
            collectorId,
            note,
        });
        console.log("reportBinIssue success:", res.data);
        return true;
    } catch (err) {
        console.error("Error in reportBinIssue:", err);
        return false;
    }
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
    try {
        const res = await API.post(`/collector/notifications/${notificationId}/read`);
        console.log("markNotificationRead success:", res.data);
        return true;
    } catch (err) {
        console.error("Error in markNotificationRead:", err);
        return false;
    }
};

export const markBinCollectedWithPhoto = async ({binId, routeId, collectorId, weight, photo}) => {
    try {
        const formData = new FormData();
        formData.append("binId", binId);
        formData.append("routeId", routeId);
        formData.append("collectorId", collectorId);
        formData.append("weightKg", weight);
        formData.append("status", "COLLECTED");
        if (photo) formData.append("photo", photo);

        const res = await API.post(`/collector/collections/mark`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return true;
    } catch (err) {
        console.error("Error in markBinCollectedWithPhoto:", err);
        return false;
    }
};