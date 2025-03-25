// src/Components/SequentialAnimations.tsx
import React, { useRef, useEffect, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import animationData1 from '../assets/recipeAnimation1.json';
import animationData2 from '../assets/recipeAnimation2.json';
import animationData3 from '../assets/recipeAnimation3.json';

const animations = [animationData1, animationData2, animationData3];

const RecipeAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let anim: AnimationItem | null = null;

    if (containerRef.current) {
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,    
        autoplay: true,
        animationData: animations[currentIndex],
      });

      anim.addEventListener('complete', () => {
        if (currentIndex < animations.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
      });
    }
    return () => {
      anim?.destroy();
    };
  }, [currentIndex]);

  return <div style={{ width: 400, height: 400 }} ref={containerRef} />;
};

export default RecipeAnimation;
