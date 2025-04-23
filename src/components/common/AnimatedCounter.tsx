'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface IAnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter = ({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className,
}: IAnimatedCounterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => {
    const number = Math.round(latest);
    return number.toLocaleString('fr-FR'); // Format with French number formatting
  });

  useEffect(() => {
    const animation = animate(count, end, {
      duration,
      ease: 'easeOut',
      onComplete: () => {
        // Ensure we end exactly at the target number
        count.set(end);
      },
    });

    return animation.stop;
  }, [count, end, duration]);

  return (
    <motion.span
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      <motion.div>{rounded}</motion.div>
      {suffix}
    </motion.span>
  );
};
