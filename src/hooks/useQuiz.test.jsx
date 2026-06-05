import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useQuiz } from './useQuiz'

describe('useQuiz', () => {
  it('초기 상태는 비어 있다', () => {
    const { result } = renderHook(() => useQuiz())
    expect(result.current.total).toBe(0)
    expect(result.current.current).toBeNull()
    expect(result.current.isFinished).toBe(false)
  })

  it('특정 장으로 시작하면 해당 문제가 로드된다', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => {
      result.current.start({ chapter: 16 })
    })
    expect(result.current.total).toBe(3)
    expect(result.current.current.chapter).toBe(16)
  })

  it('reveal 후 정답 채점하면 다음 문제로 넘어간다', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.start({ chapter: 16 }))

    act(() => result.current.reveal())
    expect(result.current.revealed).toBe(true)

    act(() => result.current.mark('correct'))
    expect(result.current.index).toBe(1)
    expect(result.current.revealed).toBe(false)
    expect(result.current.score.correct).toBe(1)
  })

  it('모든 문제를 풀면 isFinished 가 true 가 된다', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.start({ chapter: 16 }))

    act(() => result.current.mark('correct'))
    act(() => result.current.mark('wrong'))
    act(() => result.current.mark('correct'))

    expect(result.current.isFinished).toBe(true)
    expect(result.current.score).toEqual({ correct: 2, wrong: 1, answered: 3 })
  })

  it('goPrev 는 0 미만으로 내려가지 않는다', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.start({ chapter: 16 }))
    act(() => result.current.goPrev())
    expect(result.current.index).toBe(0)
  })

  it('reset 은 상태를 초기화한다', () => {
    const { result } = renderHook(() => useQuiz())
    act(() => result.current.start({ chapter: 16 }))
    act(() => result.current.mark('correct'))
    act(() => result.current.reset())
    expect(result.current.total).toBe(0)
    expect(result.current.score.answered).toBe(0)
  })
})
