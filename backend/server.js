import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import boxedRoutes from './routes/boxed.routes.js';
import returnRoutes from './routes/returned.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const dbname = process.env.DB_NAME;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/boxed', boxedRoutes);
app.use('/api/returns', returnRoutes);

http.createServer(app).listen(PORT, () => {
    console.log(`API HTTP server running on port ${PORT}`);
    console.log(`Connected DB: ${dbname}`);
});
