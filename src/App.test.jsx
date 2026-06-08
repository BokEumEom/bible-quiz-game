import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from './App'
import { QUESTIONS } from './data/questions'

// 16장 문제(3개)의 정답을 원본 순서대로: [디모데, 아볼로, 스데바나]
const CH16 = QUESTIONS.filter((q) => q.chapter === 16).map((q) => q.answer)

beforeEach(() => {
  localStorage.clear()
})

// 현재 문제의 보기에서 정답/오답을 골라 클릭한 뒤 다음으로 넘어간다.
async function answer({ correct, expected }) {
  const group = await screen.findByRole('group', { name: '보기' })
  const buttons = within(group).getAllByRole('button')
  const target = correct
    ? buttons.find((b) => b.textContent.trim() === expected)
    : buttons.find((b) => b.textContent.trim() !== expected)
  fireEvent.click(target)
  fireEvent.click(screen.getByText(/다음 문제|결과 보기/))
}

async function startCh16Quiz() {
  fireEvent.click(screen.getByText('✏️ 바로 문제 풀기'))
  fireEvent.click(await screen.findByText('16장'))
}

describe('App 통합 — 객관식 자동 채점', () => {
  it('정답 보기를 고르면 "정답!"이 표시된다', async () => {
    render(<App />)
    await startCh16Quiz()

    const group = await screen.findByRole('group', { name: '보기' })
    const correctBtn = within(group)
      .getAllByRole('button')
      .find((b) => b.textContent.trim() === CH16[0])
    fireEvent.click(correctBtn)

    expect(screen.getByText(/정답! (다음 문제|결과 보기)/)).toBeInTheDocument()
  })

  it('모두 틀리면 홈 화면에 오답 노트(3문제)가 나타난다', async () => {
    render(<App />)
    expect(screen.queryByText('📝 오답 노트 복습')).not.toBeInTheDocument()

    await startCh16Quiz()
    for (let i = 0; i < 3; i += 1) {
      await answer({ correct: false, expected: CH16[i] })
    }

    fireEvent.click(await screen.findByText('홈으로'))
    expect(await screen.findByText('📝 오답 노트 복습')).toBeInTheDocument()
    expect(screen.getByText('3문제')).toBeInTheDocument()
  })

  it('모두 맞히면 결과가 정답률 100%', async () => {
    render(<App />)
    await startCh16Quiz()
    for (let i = 0; i < 3; i += 1) {
      await answer({ correct: true, expected: CH16[i] })
    }
    expect(await screen.findByText('정답률 100%')).toBeInTheDocument()
  })

  it('퀴즈를 ✕로 중간에 나가도 채점한 오답이 노트에 남는다', async () => {
    render(<App />)
    await startCh16Quiz()

    // 1문제 틀리고 다음으로 → 2번째 문제에서 그만두기
    await answer({ correct: false, expected: CH16[0] })
    await screen.findByRole('group', { name: '보기' })
    fireEvent.click(screen.getByLabelText('그만두기'))

    expect(await screen.findByText('📝 오답 노트 복습')).toBeInTheDocument()
    expect(screen.getByText('1문제')).toBeInTheDocument()
  })
})
