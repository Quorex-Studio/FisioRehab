# 🧠 FisioRehab — Simulador Clínico 3D (WebGL)

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Experiencia web inmersiva en 3D para evaluación y seguimiento de rehabilitación clínica (parálisis facial), con narrativa scroll-telling y soporte WebXR.**

</div>

-----

## 🎯 ¿Qué es esto?

FisioRehab es una **SPA 3D de nivel Awwwards** que combina una escena WebGL reactiva con una interfaz clínica funcional. En lugar de un formulario plano, el estado del paciente (evaluación, progreso) alimenta en tiempo real un modelo anatómico renderizado en Three.js — la escena visual responde a los datos clínicos, no al revés.

Incluye un **simulador de evaluación** con cronómetro y escala de Sunnybrook (estándar clínico para parálisis facial), y una tabla de progreso para llevar el registro de sesiones.

-----

## ✨ Características principales

### 🌐 Escena 3D reactiva
- Modelo anatómico abstracto que cambia según el estado clínico (`Model.tsx`)
- Cámara animada con **GSAP**, iluminación y entorno configurados en `Scene.tsx`
- Post-procesamiento (Bloom, Chromatic Aberration, Depth of Field) vía `@react-three/postprocessing`
- Shaders GLSL para materiales premium (glassmorphism, tonos esmeralda/azul corporativo)

### 🩺 Simulador clínico
- **Escala de Sunnybrook** — evaluación estandarizada de parálisis facial (`ClinicalEvaluation.tsx`)
- Cronómetro integrado para timing de ejercicios
- Tabla de progreso con histórico de métricas (`ProgressTable.tsx`)

### 🖱️ Interacción premium
- Scroll suave por hardware con **Lenis**
- Narrativa "scroll-telling": el HUD (`HUD.tsx`) se anima con **Framer Motion** en sincronía con el scroll
- Cursor personalizado con efecto de lente magnética (`CustomCursor.tsx`)
- Botones con física de "gravedad inversa" (`MagneticButton.tsx`)

### 🥽 WebXR
- Soporte de tracking de manos vía `@react-three/xr`, pensado para uso en clínica con visor VR

-----

## 🛠️ Stack Tecnológico

```text
Framework       → React 19 + TypeScript + Vite
Enrutamiento    → react-router-dom (SPA)
3D / WebGL      → three.js + @react-three/fiber + @react-three/drei
WebAR           → <model-viewer> (Google Web Component para Realidad Aumentada)
Post-procesado  → @react-three/postprocessing (Bloom, Chromatic Aberration, DoF)
WebXR           → @react-three/xr (Tracking de manos)
Machine Learning→ @mediapipe/tasks-vision (Visión artificial)
Animación       → GSAP + Lenis (smooth scroll) + Framer Motion (HUD)
Estado global   → Zustand (sincronización DOM ↔ WebGL sin re-renders)
Estilos         → TailwindCSS + CSS Variables
Componentes UI  → shadcn/ui (Radix UI + class-variance-authority + clsx)
Lint            → Oxlint
```

-----

## 📁 Estructura del proyecto

```text
src/
├── App.tsx                          ← Enrutador principal (React Router)
├── data/                            ← Datos estáticos (ejercicios, glosario)
├── pages/                           ← Vistas de la aplicación
│   ├── Home.tsx                     ← Landing page (Scroll-telling, 3D Canvas)
│   ├── Dashboard.tsx                ← Panel de evaluación y progreso
│   └── Info.tsx                     ← Centro de recursos y glosario
├── components/
│   ├── 3d/                          ← Componentes R3F (React Three Fiber) y Modelos
│   ├── home/                        ← Secciones de la Landing Page
│   ├── ui/                          ← Componentes base (shadcn/ui)
│   ├── ArViewer.tsx                 ← Visor de Realidad Aumentada (WebXR)
│   ├── AnatomyHotspots.tsx          ← Puntos de interés anatómicos interactivos
│   ├── EvaluationScale.tsx          ← Escala de Sunnybrook (Evaluación clínica)
│   ├── ExerciseCards.tsx            ← Tarjetas de rutinas de ejercicios
│   ├── ProgressTable.tsx            ← Registro histórico de sesiones
│   └── Stopwatch.tsx                ← Cronómetro clínico para ejercicios
└── index.css                        ← Variables de Tailwind y estilos globales
```

> Nota: actualmente es una SPA de front-end puro. La persistencia de evaluaciones/pacientes en base de datos está planeada como siguiente fase (ver Próximos pasos).

-----

## ⚡ Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/Ldeath0/FisioRehab.git
cd FisioRehab

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm run dev

# 4. Build de producción
npm run build

# 5. Previsualizar el build
npm run preview
```

-----

## 📈 Próximos pasos

- [ ] Persistencia de evaluaciones y pacientes (backend / Supabase)
- [ ] Autenticación para fisioterapeutas
- [ ] Exportar reportes de progreso (PDF)
- [ ] Modo VR completo con tracking de manos en sesión real

-----

## 👨‍💻 Autor

**Michael Noriega** — Full-Stack Developer
Especializado en React, TypeScript, Supabase y experiencias web inmersivas.

- 🌐 [quorex.vercel.app](https://quorex.vercel.app)
- 💼 [github.com/Quorex-Studio](https://github.com/Quorex-Studio
- ✉️ michael.rafael03@gmail.com

-----
