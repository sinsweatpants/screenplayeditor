'use client';

import { useState, useEffect } from 'react';

type RulerProps = {
  orientation?: 'horizontal' | 'vertical';
};

const PIXELS_PER_CM = 37.8;
const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1123;

const Ruler = ({ orientation = 'horizontal' }: RulerProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={`ruler-container ${orientation}`}></div>;
  }

  const length = orientation === 'horizontal' ? PAGE_WIDTH_PX : PAGE_HEIGHT_PX;
  const lengthInCm = Math.floor(length / PIXELS_PER_CM);
  
  const elements = [];
  
  for (let i = 0; i <= lengthInCm; i++) {
    const mainTickPos = i * PIXELS_PER_CM;
    
    // Add number
    if (i > 0) {
      const numberStyle = orientation === 'horizontal'
        ? { right: `${mainTickPos}px`, transform: 'translateX(50%)' }
        : { top: `${mainTickPos}px` };
      elements.push(<span key={`num-${i}`} className="ruler-number" style={numberStyle}>{i}</span>);
    }

    // Add main tick for each cm
    const mainTickStyle = orientation === 'horizontal'
      ? { right: `${mainTickPos}px`, height: '10px' }
      : { top: `${mainTickPos}px`, width: '10px' };
    elements.push(<div key={`tick-${i}`} className="ruler-tick" style={mainTickStyle} />);
    
    if (i === lengthInCm) continue;

    // Add half-cm tick
    const halfTickPos = mainTickPos + (PIXELS_PER_CM / 2);
    const halfTickStyle = orientation === 'horizontal'
        ? { right: `${halfTickPos}px`, height: '6px' }
        : { top: `${halfTickPos}px`, width: '6px' };
    elements.push(<div key={`half-tick-${i}`} className="ruler-tick" style={halfTickStyle} />);
    
    // Add millimeter ticks
    for (let j = 1; j < 10; j++) {
        if (j === 5) continue; // Skip half-cm tick, already drawn
        const mmTickPos = mainTickPos + (j * PIXELS_PER_CM / 10);
        const mmTickStyle = orientation === 'horizontal'
            ? { right: `${mmTickPos}px`, height: '3px' }
            : { top: `${mmTickPos}px`, width: '3px' };
        elements.push(<div key={`mm-tick-${i}-${j}`} className="ruler-tick" style={mmTickStyle} />);
    }
  }

  return (
    <div className={`ruler-container ${orientation}`}>
      {elements}
    </div>
  );
};

export default Ruler;
