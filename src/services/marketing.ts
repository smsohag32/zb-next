export const getPopupConfig = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/marketing/popup`);
        if (!response.ok) throw new Error("Failed to fetch popup config");
        const data = await response.json();
        return data.data; // Server returns { status: 200, message: "...", data: { ... } }
    } catch (error) {
        console.error("Error fetching popup config:", error);
        return null;
    }
};

export const getBannerConfig = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/marketing/header_banner`);
        if (!response.ok) throw new Error("Failed to fetch banner config");
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching banner config:", error);
        return null;
    }
};
