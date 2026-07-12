import { Scene } from './components/canvas/Scene';
import { HUD } from './components/dom/HUD';
import { CustomCursor } from './components/dom/CustomCursor';
import { VRButton } from '@react-three/xr';

function App() {
  return (
    <>
      {/* 3D WebGL Background Scene */}
      <Scene />
      
      {/* DOM Overlay with Framer Motion and Lenis Scroll */}
      <HUD />
      
      {/* Custom Lens/WebGL DOM Cursor */}
      <CustomCursor />
      
      {/* Optional: React Three XR Default VR Button (Hidden behind our custom UI but initialized) */}
      <div className="hidden">
        <VRButton />
      </div>
    </>
  );
}

export default App;
