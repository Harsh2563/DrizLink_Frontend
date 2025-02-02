import { motion } from "framer-motion";
import WebSocketMonitor from "./WebSocketMonitor";

const loadingContainerVariants = {
    start: { transition: { staggerChildren: 0.2 } },
    end: { transition: { staggerChildren: 0.2 } },
};

const loadingDotVariants = {
    start: { y: '0%' },
    end: { y: '100%' },
};

const loadingDotTransition = {
    duration: 0.5,
    repeat: Infinity,
    ease: "easeInOut",
};

export const Connecting = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <WebSocketMonitor />
        <motion.div
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex space-x-2"
            variants={loadingContainerVariants}
            initial="start"
            animate="end"
          >
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="w-4 h-4 bg-blue-500 rounded-full"
                variants={loadingDotVariants}
                transition={loadingDotTransition}
              />
            ))}
          </motion.div>
          
          <motion.div
            className="text-center space-y-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white">Drizzle</h1>
            <p className="text-gray-400">Establishing connection...</p>
          </motion.div>
        </motion.div>
      </div>
    )
}