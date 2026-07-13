# FacioRehab - Mapa de Proyecto (Prototipo Clínico)

## Arquitectura y Convenciones

- **Framework Core**: Vite + React + TypeScript (TSX)
- **Motor 3D & Ecosistema WebGL**:
  - `@google/model-viewer` (Visor 3D Declarativo vía Web Components)
  - Soporte integrado de AR (WebXR, Scene Viewer, Quick Look)
- **Enrutamiento & Estado**:
  - `react-router-dom` para navegación
  - Estado local en React (`useState`, `useRef`) para el cronómetro y la telemetría clínica
- **Estilos DOM**: Tailwind CSS + CSS Variables (`src/index.css`)
- **Estética**: Interfaz clínica, limpia, profesional (Glassmorphism sutil, bordes suaves, colores corporativos azul/esmeralda).
- **Notificaciones**: `sonner` para feedback de acciones (toasts).

## Estructura de Componentes Clave:
- `/src/App.tsx` - Orquestador Principal y Enrutador
- `/src/pages/Dashboard.tsx` - Vista Principal del Simulador Clínico
- `/src/components/ArViewer.tsx` - Contenedor del Visor 3D y Detección de Dispositivos (Móvil/Escritorio)
- `/src/components/Header.tsx` - Cabecera de la aplicación
- `/src/components/Stopwatch.tsx` - Cronómetro Clínico de precisión
- `/src/components/EvaluationScale.tsx` - Tarjeta de evaluación de grados (1-5)
- `/src/components/ProgressTable.tsx` - Tabla de historial de ejercicios de la sesión
- `/src/components/ResourcesGrid.tsx` - Grid interactivo de recursos médicos
- `/src/components/ui/*` - Componentes base de UI (shadcn-like): `dialog`, `table`.

## RPCs & Base de Datos
- *Por definir cuando se integre backend. Actualmente Front-end SPA.*

## Skills & Reglas
- Reglas globales aplicadas: Mantener la limpieza y claridad de los componentes.
- Modificación completa hacia una interfaz clínica más robusta, fácil de usar y con soporte nativo de AR móvil mediante model-viewer.
