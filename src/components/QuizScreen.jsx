import { useState } from 'react'
import styles from './QuizScreen.module.css'

// 입력값과 정답의 느슨한 일치 판단 (자가 채점 보조용)
function normalize(s) {
  return s.replace(/[\s.,·()]/g, '').toLowerCase()
}

export default function QuizScreen({ quiz, isReview = false, onExit }) {
  const { current, index, total, revealed, reveal, mark, goPrev } = quiz
  const [typed, setTyped] = useState('')
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0

  const handleMark = (verdict) => {
    setTyped('')
    mark(verdict)
  }

  const handlePrev = () => {
    setTyped('')
    goPrev()
  }

  // 입력이 있고 공개됐을 때만 일치 힌트 계산
  const hint =
    revealed && typed.trim()
      ? (() => {
          const t = normalize(typed)
          const a = normalize(current.answer)
          return t.length > 0 && (a.includes(t) || t.includes(a))
        })()
      : null

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

      <div className={styles.card} key={current.id}>
        <div className={styles.meta}>
          <span className={styles.chapterBadge}>{current.chapter}장</span>
          <span className={styles.qno}>문제 {current.id}</span>
        </div>

        <p className={styles.question}>{current.question}</p>

        {!revealed ? (
          <textarea
            className={styles.board}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="정답을 적어보세요 (선택)"
            rows={2}
            aria-label="정답 입력"
          />
        ) : (
          <div className={styles.reveal}>
            {typed.trim() && (
              <div className={styles.myAnswer}>
                <span className={styles.revealLabel}>내 답</span>
                <p className={styles.myAnswerText}>{typed.trim()}</p>
              </div>
            )}
            <div className={styles.answerBox}>
              <span className={styles.answerLabel}>정답</span>
              <p className={styles.answer}>{current.answer}</p>
            </div>
            {hint !== null && (
              <p className={hint ? styles.hintMatch : styles.hintMiss}>
                {hint ? '정답과 비슷해요! 👍' : '정답과 비교해 스스로 채점하세요'}
              </p>
            )}
          </div>
        )}
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
              onClick={() => handleMark('wrong')}
            >
              ✕ 틀렸어요
            </button>
            <button
              className={`${styles.verdict} ${styles.correctBtn}`}
              onClick={() => handleMark('correct')}
            >
              ○ 맞았어요
            </button>
          </div>
        )}

        <button className={styles.prev} onClick={handlePrev} disabled={index === 0}>
          ‹ 이전 문제
        </button>
      </div>
    </div>
  )
}
