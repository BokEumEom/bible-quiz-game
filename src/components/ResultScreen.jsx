import { gradeFor } from '../utils/quiz'
import styles from './ResultScreen.module.css'

export default function ResultScreen({ score, total, questions, answers, onRetry, onHome }) {
  const { correct } = score
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0
  const grade = gradeFor(correct, total)

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <div className={styles.emoji} aria-hidden="true">
          {grade.emoji}
        </div>
        <h2 className={styles.gradeTitle}>{grade.title}</h2>
        <p className={styles.gradeMsg}>{grade.message}</p>

        <div className={styles.scoreRow}>
          <span className={styles.scoreBig}>{correct}</span>
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
        <button className={styles.retry} onClick={onRetry}>
          다시 도전
        </button>
        <button className={styles.home} onClick={onHome}>
          홈으로
        </button>
      </div>
    </div>
  )
}
