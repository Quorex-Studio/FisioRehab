import { Scene } from './components/canvas/Scene';
import { HUD } from './components/dom/HUD';
import { CustomCursor } from './components/dom/CustomCursor';

function App() {
  return (
    <>
      {/* 3D WebGL Background Scene */}
      <Scene />
      
      {/* DOM Overlay with Framer Motion and Lenis Scroll */}
      <HUD />
      
      {/* Custom Lens/WebGL DOM Cursor */}
      <CustomCursor />
    </>
  );
}

export default App;
