import styles from './QuizScreen.module.css'

export default function QuizScreen({ quiz, onExit }) {
  const { current, index, total, revealed, reveal, mark, goPrev } = quiz
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0

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

      <div className={styles.card} key={current.id}>
        <div className={styles.meta}>
          <span className={styles.chapterBadge}>{current.chapter}장</span>
          <span className={styles.qno}>문제 {current.id}</span>
        </div>

        <p className={styles.question}>{current.question}</p>

        <div className={`${styles.answerBox} ${revealed ? styles.answerShown : ''}`}>
          {revealed ? (
            <>
              <span className={styles.answerLabel}>정답</span>
              <p className={styles.answer}>{current.answer}</p>
            </>
          ) : (
            <span className={styles.answerHint}>정답을 떠올려 보세요</span>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        {!revealed ? (
          <button className={styles.revealBtn} onClick={reveal}>
            정답 확인
          </button>
        ) : (
          <div className={styles.verdictRow}>
            <button
              className={`${styles.verdict} ${styles.wrongBtn}`}
              onClick={() => mark('wrong')}
            >
              ✕ 틀렸어요
            </button>
            <button
              className={`${styles.verdict} ${styles.correctBtn}`}
              onClick={() => mark('correct')}
            >
              ○ 맞았어요
            </button>
          </div>
        )}

        <button className={styles.prev} onClick={goPrev} disabled={index === 0}>
          ‹ 이전 문제
        </button>
      </div>
    </div>
  )
}
