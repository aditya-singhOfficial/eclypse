// config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'js-yaml';

dotenv.config();

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the OpenAPI YAML file
const openapiPath = path.resolve(__dirname, '../docs/openapi.yaml');

// Read and parse the OpenAPI YAML file
let openapiDocument;
try {
    openapiDocument = YAML.load(fs.readFileSync(openapiPath, 'utf8'));
    console.log('Successfully loaded OpenAPI document');
} catch (error) {
    console.error('Error loading OpenAPI document:', error.message);
    // Provide a fallback document
    openapiDocument = {
        openapi: '3.0.3',
        info: {
            title: 'MERN E-Commerce API',
            version: '1.0.0',
            description: 'Full-featured e-commerce backend'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Local development'
            }
        ]
    };
}

// Add server configuration dynamically
const port = process.env.PORT || 3000;
if (openapiDocument.servers) {
    // Add or update the local development server
    const localServerIndex = openapiDocument.servers.findIndex(
        server => server.description === 'Local development'
    );
    
    if (localServerIndex >= 0) {
        openapiDocument.servers[localServerIndex].url = `http://localhost:${port}`;
    } else {
        openapiDocument.servers.push({
            url: `http://localhost:${port}`,
            description: 'Local development'
        });
    }
}

// Configure Swagger options to merge the YAML file with annotations in code
const options = {
    definition: {
        openapi: '3.0.3',
        ...openapiDocument,
        info: {
            title: 'MERN E-Commerce API',
            version: '1.0.0',
            description: 'Full-featured e-commerce backend with users, products, categories, carts, orders, and reviews.'
        }
    },
    apis: [
        './routes/**/*.js',
        './controllers/**/*.js',
        './models/**/*.js'
    ]
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        docExpansion: 'none',
        persistAuthorization: true
    }
});
