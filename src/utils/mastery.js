import { CHAPTERS } from '../data/questions'
import { scopeKey } from './storage'

export const TOTAL_CHAPTERS = CHAPTERS.length // 16

// 마스터한 장 수에 따른 등급 (신앙 친화 칭호)
const TIERS = [
  { min: 0, name: '새신자', icon: '🌱' },
  { min: 1, name: '제자', icon: '📖' },
  { min: 4, name: '일꾼', icon: '🤝' },
  { min: 8, name: '전도자', icon: '🔥' },
  { min: 12, name: '사역자', icon: '🕊️' },
  { min: 16, name: '골든벨 마스터', icon: '🏆' }
]

// 장 상태: 'mastered'(100%) | 'learning'(시도했으나 미완) | 'new'(미시작)
export function chapterState(progress, chapter) {
  const entry = progress?.[scopeKey(chapter)]
  if (!entry) return 'new'
  return entry.best >= 100 ? 'mastered' : 'learning'
}

// 전체 진척/등급 요약
export function getMastery(progress = {}) {
  const perChapter = CHAPTERS.map(({ chapter }) => ({
    chapter,
    state: chapterState(progress, chapter)
  }))
  const mastered = perChapter.filter((c) => c.state === 'mastered').length
  const learning = perChapter.filter((c) => c.state === 'learning').length

  // 현재 등급 = mastered 가 넘긴 가장 높은 tier
  let grade = TIERS[0]
  for (const tier of TIERS) {
    if (mastered >= tier.min) grade = tier
  }
  const next = TIERS.find((t) => t.min > mastered) || null
  const nextGradeIn = next ? next.min - mastered : 0

  return { total: TOTAL_CHAPTERS, mastered, learning, perChapter, grade, next, nextGradeIn }
}
