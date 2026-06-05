import { useCallback, useMemo, useState } from 'react'
import { buildQuestionSet } from '../utils/quiz'

// 퀴즈 한 판의 상태를 관리하는 훅.
// 모든 상태 갱신은 불변(immutable) 방식으로 처리한다.
export function useQuiz() {
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  // answers: { [questionId]: 'correct' | 'wrong' }
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState(null)

  const start = useCallback(({ chapter = null, shouldShuffle = false } = {}) => {
    try {
      const set = buildQuestionSet({ chapter, shouldShuffle })
      setQuestions(set)
      setIndex(0)
      setRevealed(false)
      setAnswers({})
      setError(null)
      return true
    } catch (caught) {
      console.error('퀴즈 시작 실패:', caught)
      setError(caught instanceof Error ? caught.message : '퀴즈를 시작할 수 없습니다.')
      return false
    }
  }, [])

  const reveal = useCallback(() => setRevealed(true), [])

  const current = questions[index] ?? null

  // 정답/오답 채점 후 자동으로 다음 문제 또는 종료로 넘어간다.
  const mark = useCallback(
    (verdict) => {
      if (!current) return
      setAnswers((prev) => ({ ...prev, [current.id]: verdict }))
      setRevealed(false)
      setIndex((prev) => prev + 1)
    },
    [current]
  )

  const goPrev = useCallback(() => {
    setRevealed(false)
    setIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const reset = useCallback(() => {
    setQuestions([])
    setIndex(0)
    setRevealed(false)
    setAnswers({})
    setError(null)
  }, [])

  const total = questions.length
  const isFinished = total > 0 && index >= total

  const score = useMemo(() => {
    const values = Object.values(answers)
    const correct = values.filter((v) => v === 'correct').length
    const wrong = values.filter((v) => v === 'wrong').length
    return { correct, wrong, answered: values.length }
  }, [answers])

  return {
    questions,
    current,
    index,
    total,
    revealed,
    answers,
    score,
    isFinished,
    error,
    start,
    reveal,
    mark,
    goPrev,
    reset
  }
}
