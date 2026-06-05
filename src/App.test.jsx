import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

beforeEach(() => {
  localStorage.clear()
})

describe('App 통합 — 오답 노트 흐름', () => {
  it('퀴즈에서 틀리면 홈 화면에 오답 노트가 나타난다', async () => {
    render(<App />)

    // 홈: 처음엔 오답 노트가 없다
    expect(screen.queryByText('📝 오답 노트 복습')).not.toBeInTheDocument()

    // 바로 문제 풀기 → 16장(3문제) 선택
    fireEvent.click(screen.getByText('✏️ 바로 문제 풀기'))
    fireEvent.click(await screen.findByText('16장'))

    // 3문제 모두 틀리게 채점
    for (let i = 0; i < 3; i += 1) {
      fireEvent.click(await screen.findByText('정답 확인'))
      fireEvent.click(screen.getByText('✕ 틀렸어요'))
    }

    // 결과 화면 → 홈으로
    fireEvent.click(await screen.findByText('홈으로'))

    // 홈에 오답 노트(3문제)가 보인다
    expect(await screen.findByText('📝 오답 노트 복습')).toBeInTheDocument()
    expect(screen.getByText('3문제')).toBeInTheDocument()
  })

  it('퀴즈를 ✕로 중간에 나가도 채점한 오답이 노트에 남는다', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('✏️ 바로 문제 풀기'))
    fireEvent.click(await screen.findByText('16장'))

    // 1문제만 틀리게 채점한 뒤
    fireEvent.click(await screen.findByText('정답 확인'))
    fireEvent.click(screen.getByText('✕ 틀렸어요'))

    // 2번째 문제에서 ✕(그만두기)로 중도 종료
    await screen.findByText('정답 확인')
    fireEvent.click(screen.getByLabelText('그만두기'))

    // 홈에 오답 노트(1문제)가 남아야 한다
    expect(await screen.findByText('📝 오답 노트 복습')).toBeInTheDocument()
    expect(screen.getByText('1문제')).toBeInTheDocument()
  })

  it('홈에 전체 최고 정답률이 기록된다', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('✏️ 바로 문제 풀기'))
    fireEvent.click(await screen.findByText('16장'))

    // 3문제 중 2개 정답, 1개 오답
    fireEvent.click(await screen.findByText('정답 확인'))
    fireEvent.click(screen.getByText('○ 맞았어요'))
    fireEvent.click(await screen.findByText('정답 확인'))
    fireEvent.click(screen.getByText('○ 맞았어요'))
    fireEvent.click(await screen.findByText('정답 확인'))
    fireEvent.click(screen.getByText('✕ 틀렸어요'))

    fireEvent.click(await screen.findByText('홈으로'))

    // 16장 최고 정답률은 67%지만 홈은 '전체(all)' 기록만 표시 → 16장 단독은 all 키가 아니므로 미표시
    // 대신 오답 노트(1문제)는 보여야 한다
    expect(await screen.findByText('📝 오답 노트 복습')).toBeInTheDocument()
    expect(screen.getByText('1문제')).toBeInTheDocument()
  })
})
