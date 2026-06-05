import { motion } from 'framer-motion'
import { gradeFor } from '../utils/quiz'
import { spring, tap } from '../motion'
import styles from './ResultScreen.module.css'

export default function ResultScreen({
  score,
  total,
  questions,
  answers,
  isReview = false,
  onRetry,
  onRetryWrong,
  onStudyAgain,
  onHome
}) {
  const { correct } = score
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0
  const grade = gradeFor(correct, total)
  const wrongIds = questions.filter((q) => answers[q.id] === 'wrong').map((q) => q.id)

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <div className={styles.emoji} aria-hidden="true">
          {grade.emoji}
        </div>
        <h2 className={styles.gradeTitle}>{grade.title}</h2>
        <p className={styles.gradeMsg}>{grade.message}</p>

        <div className={styles.scoreRow}>
          <motion.span
            className={styles.scoreBig}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...spring, delay: 0.15 }}
          >
            {correct}
          </motion.span>
          <span className={styles.scoreTotal}>/ {total}</span>
        </div>
        <p className={styles.percent}>정답률 {percent}%</p>
      </div>

      <div className={styles.review}>
        <h3 className={styles.reviewTitle}>문제 다시 보기</h3>
        <ul className={styles.list}>
          {questions.map((q) => {
            const verdict = answers[q.id]
            return (
              <li key={q.id} className={styles.item}>
                <span
                  className={`${styles.mark} ${
                    verdict === 'correct'
                      ? styles.markCorrect
                      : verdict === 'wrong'
                        ? styles.markWrong
                        : styles.markSkip
                  }`}
                >
                  {verdict === 'correct' ? '○' : verdict === 'wrong' ? '✕' : '–'}
                </span>
                <div className={styles.itemBody}>
                  <p className={styles.itemQ}>
                    <span className={styles.itemChapter}>{q.chapter}장</span>
                    {q.question}
                  </p>
                  <p className={styles.itemA}>{q.answer}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={styles.actions}>
        {!isReview && (
          <div className={styles.actionRow}>
            {onStudyAgain && (
              <motion.button className={styles.study} onClick={onStudyAgain} whileTap={tap}>
                📖 다시 학습
              </motion.button>
            )}
            <motion.button className={styles.retry} onClick={onRetry} whileTap={tap}>
              다시 도전
            </motion.button>
          </div>
        )}

        {wrongIds.length > 0 && onRetryWrong && (
          <motion.button
            className={styles.retryWrong}
            onClick={() => onRetryWrong(wrongIds)}
            whileTap={tap}
          >
            ❌ 틀린 문제만 다시 ({wrongIds.length})
          </motion.button>
        )}

        <motion.button className={styles.home} onClick={onHome} whileTap={tap}>
          홈으로
        </motion.button>
      </div>
    </div>
  )
}
