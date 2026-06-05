import { describe, it, expect } from 'vitest'
import { shuffle, buildQuestionSet, gradeFor } from './quiz'
import { TOTAL_QUESTIONS } from '../data/questions'

describe('shuffle', () => {
  it('원본 배열을 변경하지 않는다 (불변)', () => {
    const input = [1, 2, 3, 4, 5]
    const snapshot = [...input]
    shuffle(input)
    expect(input).toEqual(snapshot)
  })

  it('같은 원소를 모두 보존한다', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
    expect([...result].sort()).toEqual([...input].sort())
  })

  it('새로운 배열 인스턴스를 반환한다', () => {
    const input = [1, 2, 3]
    expect(shuffle(input)).not.toBe(input)
  })
})

describe('buildQuestionSet', () => {
  it('chapter 가 null 이면 전체 문제를 반환한다', () => {
    const set = buildQuestionSet({ chapter: null })
    expect(set).toHaveLength(TOTAL_QUESTIONS)
  })

  it('특정 장만 필터링한다', () => {
    const set = buildQuestionSet({ chapter: 1 })
    expect(set).toHaveLength(11)
    expect(set.every((q) => q.chapter === 1)).toBe(true)
  })

  it('존재하지 않는 장은 에러를 던진다', () => {
    expect(() => buildQuestionSet({ chapter: 99 })).toThrow()
  })

  it('shuffle 옵션 없이도 원본 데이터를 변형하지 않는다', () => {
    const a = buildQuestionSet({ chapter: 2 })
    const b = buildQuestionSet({ chapter: 2 })
    expect(a).toEqual(b)
    expect(a).not.toBe(b)
  })
})

describe('gradeFor', () => {
  it('만점이면 명예의 전당', () => {
    expect(gradeFor(10, 10).emoji).toBe('🏆')
  })

  it('80% 이상이면 골든벨 도전 성공', () => {
    expect(gradeFor(8, 10).title).toContain('성공')
  })

  it('60% 이상이면 합격선 통과', () => {
    expect(gradeFor(6, 10).title).toContain('합격')
  })

  it('총 문제 0이면 결과 없음', () => {
    expect(gradeFor(0, 0).title).toBe('결과 없음')
  })
})
