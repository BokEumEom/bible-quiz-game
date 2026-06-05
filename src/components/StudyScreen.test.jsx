import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StudyScreen from './StudyScreen'

const SAMPLE = [
  { id: 1, chapter: 1, question: '첫 번째 문제?', answer: '첫 정답' },
  { id: 2, chapter: 1, question: '두 번째 문제?', answer: '둘 정답' }
]

describe('StudyScreen', () => {
  it('문제와 정답을 함께 보여준다', () => {
    render(<StudyScreen questions={SAMPLE} onStartQuiz={() => {}} onHome={() => {}} />)
    expect(screen.getByText('첫 번째 문제?')).toBeInTheDocument()
    expect(screen.getByText('첫 정답')).toBeInTheDocument()
  })

  it('다음 버튼으로 다음 문제로 넘어간다', () => {
    render(<StudyScreen questions={SAMPLE} onStartQuiz={() => {}} onHome={() => {}} />)
    fireEvent.click(screen.getByText('다음 ›'))
    expect(screen.getByText('두 번째 문제?')).toBeInTheDocument()
    expect(screen.getByText('둘 정답')).toBeInTheDocument()
  })

  it('첫 문제에서 이전 버튼은 비활성화된다', () => {
    render(<StudyScreen questions={SAMPLE} onStartQuiz={() => {}} onHome={() => {}} />)
    expect(screen.getByText('‹ 이전')).toBeDisabled()
  })

  it('문제 풀기 버튼을 누르면 onStartQuiz 가 호출된다', () => {
    const onStartQuiz = vi.fn()
    render(<StudyScreen questions={SAMPLE} onStartQuiz={onStartQuiz} onHome={() => {}} />)
    fireEvent.click(screen.getByText('문제 풀기 시작'))
    expect(onStartQuiz).toHaveBeenCalledOnce()
  })
})
