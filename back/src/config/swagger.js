import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const swaggerOptions = {
    info: {
        version: "1.0.0",
        title: "Prismic project API",
        description: "API documentation for Prismic project backend services",
    },
    security: {
        BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        },
    },
    baseDir: join(__dirname, ".."), // Point to src directory
    filesPattern: ["./routes/**/*.js", "./db/schema/*.js"],
    swaggerUIPath: "/api-docs",
    exposeSwaggerUI: true,
    exposeApiDocs: true,
    apiDocsPath: "/api-docs.json",
};
