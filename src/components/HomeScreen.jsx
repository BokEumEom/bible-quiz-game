import { TOTAL_QUESTIONS } from '../data/questions'
import styles from './HomeScreen.module.css'

export default function HomeScreen({
  shouldShuffle,
  onToggleShuffle,
  onStartAll,
  onChooseChapter
}) {
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
      </div>

      <div className={styles.actions}>
        <button className={styles.primary} onClick={onStartAll}>
          전체 도전 시작
          <span className={styles.primaryHint}>{TOTAL_QUESTIONS}문제 전체</span>
        </button>

        <button className={styles.secondary} onClick={onChooseChapter}>
          장별로 풀기
          <span className={styles.secondaryHint}>1장 ~ 16장 선택</span>
        </button>

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
