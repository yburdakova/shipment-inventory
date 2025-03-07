import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

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

const keyPath = 'C:/Projects/SSL/server.key';
const certPath = 'C:/Projects/SSL/server.cert';

const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Server is running on HTTPS: https://evieapi.courthousecomputersystems.com:${PORT}`);
    console.log(`Server is connecting to db ${dbname}`);
});
