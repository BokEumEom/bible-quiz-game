import { motion } from 'framer-motion'
import { TOTAL_QUESTIONS } from '../data/questions'
import { tap } from '../motion'
import styles from './HomeScreen.module.css'

export default function HomeScreen({
  shouldShuffle,
  error,
  progress,
  wrongCount,
  onToggleShuffle,
  onStudy,
  onQuiz,
  onReviewWrong
}) {
  const best = progress?.all?.best

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.bell} aria-hidden="true">
          🔔
        </div>
        <p className={styles.eyebrow}>고린도전서 1~16장</p>
        <h1 className={styles.title}>성경 골든벨</h1>
        <p className={styles.subtitle}>
          말씀으로 도전하는 <strong>{TOTAL_QUESTIONS}문제</strong>
        </p>
        {typeof best === 'number' && <p className={styles.bestLine}>전체 최고 정답률 {best}%</p>}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <motion.button className={styles.primary} onClick={onStudy} whileTap={tap}>
          📖 학습하기
          <span className={styles.primaryHint}>정답을 보며 익힌 뒤 문제 풀기</span>
        </motion.button>

        <motion.button className={styles.secondary} onClick={onQuiz} whileTap={tap}>
          ✏️ 바로 문제 풀기
          <span className={styles.secondaryHint}>학습 없이 곧장 도전</span>
        </motion.button>

        {wrongCount > 0 && (
          <motion.button className={styles.wrongNote} onClick={onReviewWrong} whileTap={tap}>
            <span>📝 오답 노트 복습</span>
            <span className={styles.wrongCount}>{wrongCount}문제</span>
          </motion.button>
        )}

        <button
          type="button"
          className={styles.toggle}
          onClick={onToggleShuffle}
          aria-pressed={shouldShuffle}
        >
          <span className={styles.toggleLabel}>문제 순서 섞기</span>
          <span className={`${styles.switch} ${shouldShuffle ? styles.switchOn : ''}`}>
            <span className={styles.knob} />
          </span>
        </button>
      </div>

      <p className={styles.footer}>인천은현교회 · 성경 골든벨 예상문제</p>
    </div>
  )
}
