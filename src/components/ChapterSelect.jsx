import { CHAPTERS } from '../data/questions'
import styles from './ChapterSelect.module.css'

export default function ChapterSelect({ onBack, onSelect }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack} aria-label="홈으로">
          ‹
        </button>
        <h2 className={styles.heading}>장 선택</h2>
      </header>

      <p className={styles.guide}>풀고 싶은 장을 선택하세요</p>

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
