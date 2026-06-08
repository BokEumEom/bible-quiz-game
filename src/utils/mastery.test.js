import { describe, it, expect } from 'vitest'
import { getMastery, chapterState } from './mastery'

// 진도 객체 생성 헬퍼: 마스터(100%)·학습중(50%) 장 지정
function prog(mastered = [], learning = []) {
  const p = {}
  mastered.forEach((c) => {
    p[`ch-${c}`] = { best: 100 }
  })
  learning.forEach((c) => {
    p[`ch-${c}`] = { best: 50 }
  })
  return p
}

describe('getMastery', () => {
  it('빈 진도 → 새신자, 0/16', () => {
    const m = getMastery({})
    expect(m.mastered).toBe(0)
    expect(m.total).toBe(16)
    expect(m.grade.name).toBe('새신자')
    expect(m.nextGradeIn).toBe(1)
  })

  it('마스터는 best 100만 센다', () => {
    const m = getMastery(prog([1, 2, 3], [4, 5]))
    expect(m.mastered).toBe(3)
    expect(m.learning).toBe(2)
    expect(m.grade.name).toBe('제자') // 1~3장
  })

  it('4장 마스터 → 일꾼', () => {
    expect(getMastery(prog([1, 2, 3, 4])).grade.name).toBe('일꾼')
  })

  it('16장 전부 → 골든벨 마스터, 다음 등급 없음', () => {
    const all = Array.from({ length: 16 }, (_, i) => i + 1)
    const m = getMastery(prog(all))
    expect(m.mastered).toBe(16)
    expect(m.grade.name).toBe('골든벨 마스터')
    expect(m.next).toBeNull()
    expect(m.nextGradeIn).toBe(0)
  })
})

describe('chapterState', () => {
  it('mastered / learning / new 를 구분한다', () => {
    const p = prog([1], [2])
    expect(chapterState(p, 1)).toBe('mastered')
    expect(chapterState(p, 2)).toBe('learning')
    expect(chapterState(p, 3)).toBe('new')
  })
})
