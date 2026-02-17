# Booking Frontend Demo

Un proyecto React + Vite demostrando un flujo de reservas para restaurante, diseñado con simplicidad y elegancia.

## Características

- **Stack**: React, Vite, React Router DOM, CSS Modules.
- **Diseño**: Minimalista (B&W + Acento Dorado), Responsive.
- **Funcionalidad**: Wizard de reserva en 4 pasos, validación básica, gestión de estado global.

## Instalación y Ejecución

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Arrancar entorno local**:
    ```bash
    npm run dev
    ```

3.  Abrir `http://localhost:5173` en tu navegador.

## Configuración API vs Mock

El proyecto está preparado para conectarse a un backend real o funcionar con datos simulados (Mock).

### Modo Mock (Por defecto)
Si no se configura ninguna URL de API, el sistema usará el modo Mock automáticamente.
- **Disponibilidad**: Simula una llamada de red de 800ms y devuelve horas aleatorias.
- **Creación de reserva**: Simula éxito tras 800ms.

### Modo API Real
Para conectar con un backend, crea un archivo `.env` en la raíz del proyecto (copia de `.env.example` si existiera) y define:

```env
VITE_API_BASE_URL=https://tu-api-backend.com/api
```

Los endpoints esperados son:
- `GET /availability?date=YYYY-MM-DD&people=N` -> devuelve `{ lunch: [...], dinner: [...] }`
- `POST /bookings` con body JSON -> devuelve `{ success: true, ... }`

## Estructura del Proyecto

- \`src/api\`: Lógica de conexión con backend + Mock fallback.
- \`src/components\`: Componentes reutilizables (Header, etc).
- \`src/context\`: \`BookingContext\` para el estado del wizard.
- \`src/pages\`: Vistas principales (Landing, Booking, Confirmation).
- \`src/styles\`: Variables CSS globales y reset.

---
Creado como demo técnica.
