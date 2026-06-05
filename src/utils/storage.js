// localStorage 기반 진도/오답노트 저장 계층.
// 모든 접근은 try/catch 로 감싸 시크릿 모드·차단 환경에서도 앱이 죽지 않게 한다.

const PROGRESS_KEY = 'gb:progress:v1'
const WRONG_KEY = 'gb:wrong:v1'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    console.error('저장소 읽기 실패:', error)
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('저장소 쓰기 실패:', error)
    return false
  }
}

// 범위 키: null(전체) → 'all', 숫자(장) → 'ch-3'
export function scopeKey(chapter) {
  return chapter === null || chapter === undefined ? 'all' : `ch-${chapter}`
}

// { [scopeKey]: { best, bestCorrect, total, attempts } }
export function getProgress() {
  const value = read(PROGRESS_KEY, {})
  return value && typeof value === 'object' ? value : {}
}

// 한 판 결과를 기록하고 최고 기록을 갱신한다.
export function recordResult(chapter, correct, total) {
  if (total <= 0) return getProgress()
  const all = getProgress()
  const key = scopeKey(chapter)
  const prev = all[key]
  const percent = Math.round((correct / total) * 100)
  const isNewBest = !prev || percent > prev.best
  const next = {
    ...all,
    [key]: {
      best: prev ? Math.max(prev.best, percent) : percent,
      bestCorrect: isNewBest ? correct : prev.bestCorrect,
      total,
      attempts: (prev?.attempts ?? 0) + 1
    }
  }
  write(PROGRESS_KEY, next)
  return next
}

export function getWrongIds() {
  const arr = read(WRONG_KEY, [])
  return Array.isArray(arr) ? arr : []
}

// 틀린 id 는 추가, 맞춘 id 는 제거 — 오답노트를 항상 최신으로 유지한다.
export function updateWrongNote(wrongIds, correctedIds) {
  const current = new Set(getWrongIds())
  wrongIds.forEach((id) => current.add(id))
  correctedIds.forEach((id) => current.delete(id))
  const next = [...current].sort((a, b) => a - b)
  write(WRONG_KEY, next)
  return next
}

export function clearWrongNote() {
  write(WRONG_KEY, [])
  return []
}
