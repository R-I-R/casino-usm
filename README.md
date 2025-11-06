# Casino USM

Aplicación Next.js (App Router) con Tailwind CSS y componentes Radix UI.

Este repositorio contiene la aplicación front-end de Casino USM (Next.js 15, React 19).

## Resumen

- Framework: Next.js
- React: 19
- Gestor de paquetes: pnpm (el proyecto incluye `pnpm-lock.yaml`)
- Node recomendado: 22.x (el `Dockerfile` usa `node:22`)

## Requisitos previos

- Docker


## Ejecutar con Docker Compose (recomendado para desarrollo)

Este proyecto ya incluye un archivo `compose.yml` preparado para desarrollo. El servicio principal (`web`) construye la imagen desde el `Dockerfile` y ejecuta el servidor de desarrollo de Next.js (puerto 3000).

Comandos útiles (desde la raíz del repositorio):

- Levantar el servicio (con build) en primer plano:

```powershell
docker compose -f compose.yml up --build
```

- Levantar el servicio en segundo plano (detached):

```powershell
docker compose -f compose.yml up --build -d
```

- Ver logs del servicio `web`:

```powershell
docker compose -f compose.yml logs -f web
```

- Parar y eliminar contenedores, redes y volúmenes anónimos creados por Compose:

```powershell
docker compose -f compose.yml down
```


Detalles útiles sobre la configuración incluida (`compose.yml`):

- El servicio mapea el puerto `3000` del contenedor al `3000` del host.
- Hay volúmenes nombrados para `node_modules`, cache de Next (`.next`) y el store de pnpm para acelerar las recargas en entornos Windows/macOS.
- Las variables de entorno para mejorar el file watching en bind mounts (ej. `WATCHPACK_POLLING`, `CHOKIDAR_USEPOLLING`) ya están definidas.
