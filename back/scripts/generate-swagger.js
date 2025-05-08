// scripts/generate-swagger.js
import express from 'express';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { swaggerOptions } from '../src/config/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerPath = join(__dirname, '..', 'swagger.json');

// Create a real express app
const app = express();

// Initialize swagger
const instance = expressJSDocSwagger(app)(swaggerOptions);

// Listen for the finish event
instance.on('finish', (spec) => {
  try {
    console.log('Writing swagger spec to:', swaggerPath);
    writeFileSync(swaggerPath, JSON.stringify(spec, null, 2));
    console.log('Swagger JSON file generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to write Swagger JSON file:', error);
    process.exit(1);
  }
});

// Listen for errors
instance.on('error', (error) => {
  console.error('Failed to generate Swagger spec:', error);
  process.exit(1);
});