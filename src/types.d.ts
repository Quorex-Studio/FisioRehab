import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: string | boolean;
        'auto-rotate'?: string | boolean;
        'auto-rotate-delay'?: string | number;
        'rotation-per-second'?: string;
        ar?: string | boolean;
        'ar-modes'?: string;
        'environment-image'?: string;
        'shadow-intensity'?: string | number;
        exposure?: string | number;
        'interaction-prompt'?: string;
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}
