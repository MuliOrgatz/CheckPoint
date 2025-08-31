import developmentConfig from './environment.dev';

interface Config {
  production: boolean;
  bookingApiUrl: string;
  userApiUrl: string;
}

const env = process.env.NODE_ENV || 'development';

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

// Default config
let config: Config = {
  production: false,
  bookingApiUrl: '',
  userApiUrl: '',
};

// Assign the correct configuration based on the environment
switch (env) {
  case 'development':
  default:
    config = developmentConfig;
}

export default config;
