import { useCallback, useEffect, useState } from 'react'
import { useQuiz } from './hooks/useQuiz'
import HomeScreen from './components/HomeScreen'
import ChapterSelect from './components/ChapterSelect'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import styles from './App.module.css'

// 화면 상태: home → (chapter) → quiz → result
export default function App() {
  const [screen, setScreen] = useState('home')
  const [shouldShuffle, setShouldShuffle] = useState(false)
  const quiz = useQuiz()

  // 퀴즈를 다 풀면 자동으로 결과 화면으로 이동
  useEffect(() => {
    if (screen === 'quiz' && quiz.isFinished) {
      setScreen('result')
    }
  }, [screen, quiz.isFinished])

  const startQuiz = useCallback(
    (chapter) => {
      const ok = quiz.start({ chapter, shouldShuffle })
      if (ok) setScreen('quiz')
    },
    [quiz, shouldShuffle]
  )

  const goHome = useCallback(() => {
    quiz.reset()
    setScreen('home')
  }, [quiz])

  return (
    <div className={styles.shell}>
      {screen === 'home' && (
        <HomeScreen
          shouldShuffle={shouldShuffle}
          onToggleShuffle={() => setShouldShuffle((prev) => !prev)}
          onStartAll={() => startQuiz(null)}
          onChooseChapter={() => setScreen('chapter')}
        />
      )}

      {screen === 'chapter' && (
        <ChapterSelect onBack={goHome} onSelect={(chapter) => startQuiz(chapter)} />
      )}

      {screen === 'quiz' && quiz.current && <QuizScreen quiz={quiz} onExit={goHome} />}

      {screen === 'result' && (
        <ResultScreen
          score={quiz.score}
          total={quiz.total}
          questions={quiz.questions}
          answers={quiz.answers}
          onRetry={() => {
            const chapter = quiz.questions[0]?.chapter ?? null
            // 전체 모드였는지 장 모드였는지 추정: 모든 문제 장이 동일하면 그 장만 다시
            const sameChapter = quiz.questions.every((q) => q.chapter === chapter)
            startQuiz(sameChapter && quiz.total < 100 ? chapter : null)
          }}
          onHome={goHome}
        />
      )}
    </div>
  )
}
