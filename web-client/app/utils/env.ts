import * as dotenv from 'dotenv';
import path from 'node:path';

// Determine which env file to load
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

// Load the environment file
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  dotenv.config({
    path: path.resolve(process.cwd(), envFile)
  });
} 
// else {
//   dotenv.config({
//     path: ""
//   });
// }

// Fallback to default .env if NODE_ENV isn't set
if (!process.env.NODE_ENV) {
  dotenv.config();
}

// Export configuration
export const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  api_endpoint: process.env.API_ENDPOINT
  // Add other variables as needed
};

// Type safety for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_ENDPOINT: string;
    }
  }
}