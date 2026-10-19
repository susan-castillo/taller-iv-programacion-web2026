import express from 'express';
import { integrantes } from './data/integrantes.js';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    message: 'El API está funcionando correctamente.'
  });
});

app.get('/api/info', (_request, response) => {
  response.json({
    status: 'ok',
    integrantes
  });
});

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});
