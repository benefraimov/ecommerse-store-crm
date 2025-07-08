export const BACKEND_URL = (import.meta.env.VITE_ENVIRONMENT === "production" ?
    import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_DEV) || "https://ecommerse-api.zoomtech.co.il";