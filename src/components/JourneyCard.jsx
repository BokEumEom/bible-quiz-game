import { motion } from 'framer-motion'
import { getMastery } from '../utils/mastery'
import { staggerContainer, staggerItem } from '../motion'
import styles from './JourneyCard.module.css'

// 성장 지도 + 등급: 등급 칭호 + 16장 점등 바 + 다음 등급 안내
export default function JourneyCard({ progress }) {
  const m = getMastery(progress)

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.grade}>
          <span className={styles.gradeIcon} aria-hidden="true">
            {m.grade.icon}
          </span>
          {m.grade.name}
        </span>
        <span className={styles.count}>
          마스터 <strong>{m.mastered}</strong>/{m.total}
        </span>
      </div>

      <motion.div
        className={styles.bar}
        role="img"
        aria-label={`16장 중 ${m.mastered}장 마스터`}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {m.perChapter.map((c) => (
          <motion.span
            key={c.chapter}
            variants={staggerItem}
            className={`${styles.seg} ${
              c.state === 'mastered'
                ? styles.segMastered
                : c.state === 'learning'
                  ? styles.segLearning
                  : ''
            }`}
          />
        ))}
      </motion.div>

      <p className={styles.hint}>
        {m.next ? `다음 등급 '${m.next.name}'까지 ${m.nextGradeIn}장` : '모든 장을 정복했어요! 🎉'}
      </p>
    </div>
  )
}
