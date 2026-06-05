import { describe, it, expect, beforeEach } from 'vitest'
import {
  scopeKey,
  getProgress,
  recordResult,
  getWrongIds,
  updateWrongNote,
  clearWrongNote
} from './storage'

beforeEach(() => {
  localStorage.clear()
})

describe('scopeKey', () => {
  it('null 은 전체(all)', () => {
    expect(scopeKey(null)).toBe('all')
  })
  it('숫자는 장 키', () => {
    expect(scopeKey(3)).toBe('ch-3')
  })
})

describe('recordResult', () => {
  it('첫 기록을 저장한다', () => {
    recordResult(1, 8, 11)
    const p = getProgress()
    expect(p['ch-1'].best).toBe(73)
    expect(p['ch-1'].attempts).toBe(1)
  })

  it('더 높은 점수만 최고 기록을 갱신한다', () => {
    recordResult(1, 5, 11) // 45%
    recordResult(1, 9, 11) // 82%
    recordResult(1, 6, 11) // 55% — 갱신 안 됨
    const p = getProgress()
    expect(p['ch-1'].best).toBe(82)
    expect(p['ch-1'].bestCorrect).toBe(9)
    expect(p['ch-1'].attempts).toBe(3)
  })

  it('total 0 이면 기록하지 않는다', () => {
    recordResult(1, 0, 0)
    expect(getProgress()).toEqual({})
  })
})

describe('오답노트', () => {
  it('틀린 id 를 추가한다', () => {
    updateWrongNote([3, 1, 2], [])
    expect(getWrongIds()).toEqual([1, 2, 3])
  })

  it('맞춘 id 는 제거한다', () => {
    updateWrongNote([1, 2, 3], [])
    updateWrongNote([], [2])
    expect(getWrongIds()).toEqual([1, 3])
  })

  it('중복은 한 번만 저장된다', () => {
    updateWrongNote([1, 1, 2], [])
    expect(getWrongIds()).toEqual([1, 2])
  })

  it('clearWrongNote 는 비운다', () => {
    updateWrongNote([1, 2], [])
    clearWrongNote()
    expect(getWrongIds()).toEqual([])
  })
})
