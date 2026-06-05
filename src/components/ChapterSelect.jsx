import { CHAPTERS, TOTAL_QUESTIONS } from '../data/questions'
import styles from './ChapterSelect.module.css'

// mode: 'study' | 'quiz' — 선택 후 이어질 행동에 맞춰 문구를 바꾼다.
// onSelect(chapter): chapter 가 null 이면 전체 범위.
export default function ChapterSelect({ mode = 'study', onBack, onSelect }) {
  const isStudy = mode === 'study'
  const heading = isStudy ? '학습할 범위' : '풀 범위'
  const guide = isStudy ? '익히고 싶은 범위를 선택하세요' : '풀고 싶은 범위를 선택하세요'

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack} aria-label="홈으로">
          ‹
        </button>
        <h2 className={styles.heading}>{heading}</h2>
      </header>

      <p className={styles.guide}>{guide}</p>

      <button className={styles.allCard} onClick={() => onSelect(null)}>
        <span className={styles.allLabel}>전체</span>
        <span className={styles.allCount}>{TOTAL_QUESTIONS}문제 · 1~16장</span>
      </button>

      <div className={styles.grid}>
        {CHAPTERS.map(({ chapter, count }) => (
          <button key={chapter} className={styles.card} onClick={() => onSelect(chapter)}>
            <span className={styles.chapterNo}>{chapter}장</span>
            <span className={styles.count}>{count}문제</span>
          </button>
        ))}
      </div>
    </div>
  )
}
