import cors, { CorsOptions } from 'cors'

const whitelist = [
  process.env.CLIENT_URL,
  'http://localhost:5173'
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable cookies/auth headers
};

export default cors(corsOptions);