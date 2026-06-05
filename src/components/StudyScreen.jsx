import { useState } from 'react'
import { motion } from 'framer-motion'
import { slideTransition, tap } from '../motion'
import styles from './StudyScreen.module.css'

// 학습 모드: 문제와 정답을 함께 보며 익힌다. 채점은 없다.
export default function StudyScreen({ questions, onStartQuiz, onHome }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1: 다음, -1: 이전

  const total = questions.length
  const current = questions[index] ?? null
  const isLast = index >= total - 1
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0

  if (!current) return null

  const goPrev = () => {
    setDirection(-1)
    setIndex((prev) => Math.max(0, prev - 1))
  }
  const goNext = () => {
    setDirection(1)
    setIndex((prev) => Math.min(total - 1, prev + 1))
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.exit} onClick={onHome} aria-label="홈으로">
          ✕
        </button>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.counter}>
          {index + 1}/{total}
        </span>
      </header>

      <p className={styles.modeHint}>📖 학습 모드 · 정답을 확인하며 익히세요</p>

      <motion.div
        className={styles.card}
        key={current.id}
        initial={{ opacity: 0, x: direction * 56 }}
        animate={{ opacity: 1, x: 0 }}
        transition={slideTransition}
      >
        <div className={styles.meta}>
          <span className={styles.chapterBadge}>{current.chapter}장</span>
          <span className={styles.qno}>문제 {current.id}</span>
        </div>

        <p className={styles.question}>{current.question}</p>

        <div className={styles.answerBox}>
          <span className={styles.answerLabel}>정답</span>
          <p className={styles.answer}>{current.answer}</p>
        </div>
      </motion.div>

      <div className={styles.controls}>
        <div className={styles.navRow}>
          <button className={styles.nav} onClick={goPrev} disabled={index === 0}>
            ‹ 이전
          </button>
          <button className={styles.nav} onClick={goNext} disabled={isLast}>
            다음 ›
          </button>
        </div>

        <motion.button className={styles.quizBtn} onClick={onStartQuiz} whileTap={tap}>
          {isLast ? '학습 끝! 문제 풀기' : '문제 풀기 시작'}
        </motion.button>
      </div>
    </div>
  )
}
