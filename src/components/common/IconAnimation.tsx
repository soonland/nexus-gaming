'use client';

import { motion } from 'framer-motion';

interface IIconAnimationProps {
  children: React.ReactNode;
}

export const IconAnimation = ({ children }: IIconAnimationProps) => {
  return (
    <motion.div
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }}
      whileHover={{
        rotate: [0, -10, 10, -5, 5, 0],
        scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
      }}
    >
      {children}
    </motion.div>
  );
};
