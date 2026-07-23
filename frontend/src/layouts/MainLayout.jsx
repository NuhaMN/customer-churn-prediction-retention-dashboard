import { motion } from 'framer-motion';

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary text-silver font-sans">
      <motion.main
        className="max-w-7xl mx-auto p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
}

export default MainLayout;