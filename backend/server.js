require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { firebaseProjectId } = require('./firebaseAdmin');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (request, response) => {
	response.json({
		ok: true,
		firebaseProjectId,
	});
});

app.listen(port, () => {
	console.log(`Backend server listening on port ${port}`);
	console.log(`Firebase Admin connected to project ${firebaseProjectId}`);
});
