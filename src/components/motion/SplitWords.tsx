import { motion } from 'framer-motion';

interface SplitWordsProps {
  text: string;
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const wordVariants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function SplitWords({ text, className }: SplitWordsProps) {
  const words = text.split(' ');

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </motion.span>
  );
}
