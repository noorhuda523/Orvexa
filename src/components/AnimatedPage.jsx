/**
 * AnimatedPage — wraps every app page with a Framer Motion entrance/exit.
 * Drop this around <Outlet /> in layouts or use directly in pages.
 */
import { motion } from 'framer-motion';
import { pageVariants } from '../motion/variants';

export default function AnimatedPage({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
