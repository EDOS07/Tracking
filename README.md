# Tracking

Este proyecto es aplicación de rastreo de paquetería monolítico, desarrollado con **React**, **TypeScript**, **Vite**, **Tailwind CSS** y **TanStack Query**.

## 🚀 Tecnologías Principales
- **Vite + pnpm**: Para un entorno de desarrollo rápido y una gestión de dependencias eficiente.
- **TypeScript**: Tipado estricto para garantizar la robustez del código.
- **TanStack Query (React Query)**: Gestión de estado asíncrono, almacenamiento en caché y optimización de peticiones de red.
- **React Router Dom**: Manejo de rutas del lado del cliente para la navegación hacia los detalles.
- **Vitest + React Testing Library**: Entorno de pruebas unitarias nativo y veloz compatible con Vite.
- **Tailwind CSS**: Maquetación responsiva y ágil.

## 📁 Arquitectura del Proyecto

El código está organizado bajo una arquitectura modular orientada por responsabilidades, promoviendo separación de conceptos, reutilización y mantenibilidad.

```text
src/
├── api/                  # Capa de infraestructura (Peticiones HTTP)
├── components/           # Componentes modulares de UI (Dumb Components)
│   ├── common/           # Componentes reutilizables genéricos
│   ├── orders/           # UI de la lista de órdenes (Vista Principal)
│   └── details/          # UI del detalle de la orden (Vista Detalle)
├── hooks/                # Custom hooks (Lógica de estado y temporizadores)
├── mappers/              # Transformación y limpieza de datos de la API
├── pages/                # Contenedores de vistas principales (Smart Components)
├── router/               # Configuración de rutas de la aplicación
├── types/                # Interfaces y tipos estrictos de TypeScript
├── utils/                # Funciones auxiliares puras (Formateadores, validadores)
├── App.tsx               # Proveedores globales (QueryClient, Router)
└── main.tsx              # Punto de entrada de la aplicación
```

## 🛡️ Capa de Tipado (DTOs vs Models)

Implementamos una separación estricta de tipos:
1. **DTOs (`src/types/dto/`)**: Estructuras espejo de las respuestas crudas de la API REST.
2. **Models (`src/types/models/`)**: Interfaces limpias en `camelCase` optimizadas para el consumo 
de los componentes de React, abstrayendo la complejidad de las marcas de tiempo e información anidada.

## 🔌 Capa de Servicios API (`src/api/`)

- Se utiliza el API **`fetch` nativo** de JavaScript encapsulado en un módulo de servicios (`cargoService.ts`).
- **Aislamiento de Entorno**: Configurado mediante variables de entorno de Vite (`import.meta.env`), permitiendo intercambiar de manera transparente la URL de producción con servidores de mocks locales durante la fase de testing.

## 🔄 Capa de Transformación (`src/mappers/`)

- Se implementa el objeto **`orderMapper`** encargado de normalizar las respuestas del servidor.
- **Saneamiento de datos**: Convierte los Timestamps Unix (números) en instancias nativas de `Date` de JavaScript, facilitando la comparación de tiempos en tiempo real.
- **Aplanamiento de Estructuras**: Consolida listas complejas en un único arreglo plano `timeline`, abstrayendo la complejidad estructural del componente visual.

## 🧠 Gestión de Estado Asíncrono con TanStack Query (`src/hooks/`)

- **Aislamiento de Hooks**: Se crearon `useFetchOrders` y `useFetchOrderDetail` para separar la lógica de consumo de los componentes visuales.
- **Transformación Centralizada (`select`)**: Se aprovecha la capacidad nativa de React Query para mutar los datos de entrada (`DTO`) hacia estructuras de dominio (`Models`) antes de guardarlos en la caché local, optimizando los ciclos de renderizado.
- **Estrategia de Caché**: Configuración de `staleTime` optimizada para que al navegar entre el listado y el detalle, la experiencia del usuario sea instantánea (cero pantallas de carga repetitivas si los datos ya existen).

## 🧱 Estructura de Cascarón y Enrutamiento (`src/router/` & `src/App.tsx`)

- **Navegación basada en URL**: Se utiliza `react-router-dom` mapeando las rutas hacia identificadores dinámicos (`/orders/:id`). Esto elimina la necesidad de sincronizar estados compartidos entre componentes mediante contextos globales.
- **Layout de Desbordamiento Independiente**: El layout principal (`MainLayout`) bloquea el scroll del viewport general (`overflow-hidden`) y segmenta las vistas en zonas independientes, garantizando que los listados de datos mantengan su propio comportamiento responsivo sin romper la cabecera.

## ⏰ Componentes Dinámicos y Temporizadores (`src/components/orders/`)

- **Aislamiento de Lógica Temporal**: Se implementa `useNavigationTimer` desacoplado de la UI del botón, asegurando que el ciclo de vida del `setInterval` se limpie de forma estricta al desmontar el componente (`cleanup function`), previniendo fugas de memoria (*memory leaks*).
- **Desacoplamiento de Eventos**: El botón de navegación ejecuta un control de propagación para impedir que la interacción de disparo de consola interfiera con el evento de selección global del contenedor superior de la orden.

## 🚀 Despliegue

El proyecto está optimizado para despliegue vía FTP/Apache. Asegúrate de incluir el archivo dist/ para soportar el enrutamiento del lado del cliente (React Router)

## 👨‍💻 Desarrollador
- **Eduardo Orozco Full-stack Developer**
- **Desarrollado con pasión por las aplicaciones web de alto rendimiento.**