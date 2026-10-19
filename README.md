# Taller IV — React y API REST

Proyecto educativo con un frontend en Vite, React y Reactstrap, conectado a una API REST en Express.

## Requisitos

- Node.js 20.19 o superior
- npm

## Iniciar el proyecto

Desde la carpeta raíz:

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` y la API en `http://localhost:3001`. Vite reenvía las solicitudes `/api` al servidor Express durante el desarrollo.

También se pueden iniciar por separado:

```bash
npm run dev:api
npm run dev:frontend
```

## Endpoints

- `GET /api/health`: devuelve el estado y un mensaje de funcionamiento.
- `GET /api/info`: devuelve la lista de integrantes con nombre, edad, carrera y materias aprobadas.
