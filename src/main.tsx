import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGlobalButtonEffects } from './utils/buttonEffects.ts';

// Initialize global 3D press interactions, haptics & smoky glow
initGlobalButtonEffects();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

