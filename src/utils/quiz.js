import { QUESTIONS } from '../data/questions'

// Fisher-Yates shuffle that returns a NEW array (never mutates the input).
export function shuffle(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

// Build a question set for a quiz run.
// chapter: null 이면 전체, 숫자면 해당 장만.
// shouldShuffle: 문제 순서를 섞을지 여부.
export function buildQuestionSet({ chapter = null, shouldShuffle = false } = {}) {
  const filtered =
    chapter === null ? QUESTIONS : QUESTIONS.filter((item) => item.chapter === chapter)

  if (filtered.length === 0) {
    throw new Error(`선택한 범위(${chapter}장)에 해당하는 문제가 없습니다.`)
  }

  return shouldShuffle ? shuffle(filtered) : [...filtered]
}

// 점수에 따른 등급/격려 메시지.
export function gradeFor(correct, total) {
  if (total === 0) {
    return { title: '결과 없음', message: '풀어본 문제가 없어요.', emoji: '🤔' }
  }

  const ratio = correct / total

  if (ratio === 1) {
    return { title: '골든벨 명예의 전당!', message: '전 문제 정답! 완벽합니다.', emoji: '🏆' }
  }
  if (ratio >= 0.8) {
    return { title: '골든벨 도전 성공', message: '훌륭해요! 거의 다 맞혔어요.', emoji: '🔔' }
  }
  if (ratio >= 0.6) {
    return { title: '합격선 통과', message: '잘했어요. 조금만 더 채워봐요.', emoji: '😊' }
  }
  if (ratio >= 0.4) {
    return { title: '다시 도전!', message: '절반 가까이 맞혔어요. 복습하면 됩니다.', emoji: '💪' }
  }
  return {
    title: '말씀과 더 친해지기',
    message: '괜찮아요. 한 번 더 읽고 도전해봐요.',
    emoji: '📖'
  }
}
