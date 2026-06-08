import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { slideVariants, tap } from '../motion'
import { buildOptions, sameAnswer } from '../utils/quiz'
import styles from './QuizScreen.module.css'

// 객관식 4지선다 자동 채점 퀴즈.
export default function QuizScreen({ quiz, isReview = false, onExit }) {
  const { current, index, total, mark, goPrev } = quiz
  const [selected, setSelected] = useState(null)
  const [direction, setDirection] = useState(1) // 1: 다음, -1: 이전
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0
  const isLast = index === total - 1

  // 문제마다 보기를 한 번만 생성 (재렌더 시 순서 고정)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = useMemo(() => buildOptions(current), [current.id])

  const answered = selected !== null
  const isCorrect = answered && sameAnswer(selected, current.answer)

  const choose = (opt) => {
    if (!answered) setSelected(opt)
  }

  const next = () => {
    setDirection(1)
    mark(isCorrect ? 'correct' : 'wrong')
    setSelected(null)
  }

  const prev = () => {
    setDirection(-1)
    setSelected(null)
    goPrev()
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.exit} onClick={onExit} aria-label="그만두기">
          ✕
        </button>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.counter}>
          {index + 1}/{total}
        </span>
      </header>

      {isReview && <p className={styles.reviewHint}>📝 오답 복습 중 · 맞히면 노트에서 빠집니다</p>}

      <div className={styles.cardArea}>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            className={styles.card}
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className={styles.meta}>
              <span className={styles.chapterBadge}>{current.chapter}장</span>
              <span className={styles.qno}>문제 {current.id}</span>
            </div>

            <p className={styles.question}>{current.question}</p>

            <div className={styles.options} role="group" aria-label="보기">
              {options.map((opt) => {
                const isAnswer = sameAnswer(opt, current.answer)
                const isChosen = answered && sameAnswer(opt, selected)
                const cls = !answered
                  ? styles.option
                  : isAnswer
                    ? `${styles.option} ${styles.optCorrect}`
                    : isChosen
                      ? `${styles.option} ${styles.optWrong}`
                      : `${styles.option} ${styles.optDim}`
                return (
                  <motion.button
                    key={opt}
                    className={cls}
                    onClick={() => choose(opt)}
                    disabled={answered}
                    whileTap={answered ? undefined : tap}
                  >
                    <span className={styles.optMark}>
                      {answered && isAnswer ? '○' : answered && isChosen ? '✕' : ''}
                    </span>
                    <span className={styles.optText}>{opt}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.controls}>
        {answered ? (
          <motion.button
            className={isCorrect ? styles.nextCorrect : styles.nextWrong}
            onClick={next}
            whileTap={tap}
          >
            {isCorrect
              ? isLast
                ? '정답! 결과 보기'
                : '정답! 다음 문제 →'
              : isLast
                ? '결과 보기'
                : '다음 문제 →'}
          </motion.button>
        ) : (
          <button className={styles.prev} onClick={prev} disabled={index === 0}>
            ‹ 이전 문제
          </button>
        )}
      </div>
    </div>
  )
}
