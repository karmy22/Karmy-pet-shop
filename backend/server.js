require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { connectDatabase } = require('./db');
const { firebaseProjectId } = require('./firebaseAdmin');
const catalogRoutes = require('./routes/catalogRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = Number(process.env.PORT) || 5000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, same-origin server calls)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (request, response) => {
	response.json({
		ok: true,
		firebaseProjectId,
	});
});

app.use('/api/catalog', catalogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((error, request, response, next) => {
	const status = error.status || 500;
	const message = error.message || 'Unexpected server error';

	if (status >= 500) {
		console.error('Unhandled server error:', error);
	}

	response.status(status).json({ error: message });
});

async function startServer() {
	await connectDatabase();

	app.listen(port, () => {
		console.log(`Backend server listening on port ${port}`);
		console.log(`Firebase Admin connected to project ${firebaseProjectId}`);
		console.log('MongoDB connection established');
	});
}

startServer().catch((error) => {
	console.error('Failed to start backend:', error);
	process.exit(1);
});
