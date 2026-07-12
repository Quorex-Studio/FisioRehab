# FacioRehab - Mapa de Proyecto (Awwwards WebGL Edition)

## Arquitectura y Convenciones

- **Framework Core**: Vite + React + TypeScript (TSX)
- **Motor 3D & Ecosistema WebGL**:
  - `three.js` & `@react-three/fiber`
  - `@react-three/drei` (Helpers y Materiales Avanzados)
  - `@react-three/postprocessing` (Bloom, Chromatic Aberration, Depth of Field)
- **Cinemática & UI Overlay**:
  - `gsap` + `lenis` (Smooth Scrolling de Hardware)
  - `framer-motion` (HUD Animations & Magnetic Buttons)
- **Estado Global & Telemetría**:
  - `zustand` (Sincronización DOM/WebGL sin re-renders)
- **WebXR**:
  - `@react-three/xr` (Para tracking de manos en clínica VR)
- **Estilos DOM**: Tailwind CSS + CSS Variables (`src/index.css`)
- **Estética**: Premium, inmersiva, volumétrica, "glassmorphism", colores blancos/esmeralda/azul corporativo con Shaders GLSL.

## Estructura de Componentes Clave:
- `/src/App.tsx` - Orquestador Principal (Canvas 3D + HUD)
- `/src/store/useClinicalStore.ts` - Estado Global de Ejercicios Clínicos y Telemetría
- `/src/components/canvas/Scene.tsx` - Escena 3D Raíz (Luces, Cámara GSAP, Entorno, Post-Procesamiento)
- `/src/components/canvas/Model.tsx` - Modelo Anatómico Abstracto WebGL reactivo al estado clínico
- `/src/components/dom/HUD.tsx` - Interfaz sobrepuesta (DOM) usando Framer Motion y Scroll-Telling
- `/src/components/dom/ClinicalEvaluation.tsx` - Interfaz de Simulador Clínico (Cronómetro, Tarjetas, Escala Sunnybrook)
- `/src/components/dom/ProgressTable.tsx` - Tabla de registros y métricas
- `/src/components/dom/CustomCursor.tsx` - Cursor dinámico/lente magnética
- `/src/components/dom/MagneticButton.tsx` - Componente de botón con física de gravedad inversa

## RPCs & Base de Datos
- *Por definir cuando se integre backend. Actualmente Front-end SPA 3D.*

## Skills & Reglas
- Reglas globales aplicadas: Experiencia Awwwards de más de $20k. No placeholders simples, UI/UX de vanguardia.
- Modificación completa del flujo de trabajo clínico estático hacia narrativa "Scroll-Telling".
