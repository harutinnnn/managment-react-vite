declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.webp";

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_NODE_ENV: "development" | "production" | "test";
    // add other VITE_ variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}