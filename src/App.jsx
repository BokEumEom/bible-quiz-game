import { useCallback, useEffect, useState } from 'react'
import { useQuiz } from './hooks/useQuiz'
import { buildQuestionSet } from './utils/quiz'
import HomeScreen from './components/HomeScreen'
import ChapterSelect from './components/ChapterSelect'
import StudyScreen from './components/StudyScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import styles from './App.module.css'

// 화면 흐름:
//   home → scope → study → quiz → result   (학습하기)
//   home → scope → quiz → result           (바로 문제 풀기)
export default function App() {
  const [screen, setScreen] = useState('home')
  const [mode, setMode] = useState('study') // 범위 선택 화면이 어떤 행동으로 이어질지
  const [shouldShuffle, setShouldShuffle] = useState(false)
  const [scopeChapter, setScopeChapter] = useState(null) // null = 전체
  const [studyQuestions, setStudyQuestions] = useState([])
  const [error, setError] = useState(null)
  const quiz = useQuiz()

  // 퀴즈를 다 풀면 자동으로 결과 화면으로 이동
  useEffect(() => {
    if (screen === 'quiz' && quiz.isFinished) {
      setScreen('result')
    }
  }, [screen, quiz.isFinished])

  // 학습 모드: 항상 정렬된(원본 순서) 문제 세트로 익힌다
  const startStudy = useCallback((chapter) => {
    try {
      const set = buildQuestionSet({ chapter, shouldShuffle: false })
      setStudyQuestions(set)
      setScopeChapter(chapter)
      setError(null)
      setScreen('study')
    } catch (caught) {
      console.error('학습 시작 실패:', caught)
      setError(caught instanceof Error ? caught.message : '학습을 시작할 수 없습니다.')
    }
  }, [])

  const startQuiz = useCallback(
    (chapter) => {
      const ok = quiz.start({ chapter, shouldShuffle })
      if (ok) {
        setScopeChapter(chapter)
        setScreen('quiz')
      }
    },
    [quiz, shouldShuffle]
  )

  const onScopeSelect = useCallback(
    (chapter) => {
      if (mode === 'study') startStudy(chapter)
      else startQuiz(chapter)
    },
    [mode, startStudy, startQuiz]
  )

  const goHome = useCallback(() => {
    quiz.reset()
    setStudyQuestions([])
    setError(null)
    setScreen('home')
  }, [quiz])

  return (
    <div className={styles.shell}>
      {screen === 'home' && (
        <HomeScreen
          shouldShuffle={shouldShuffle}
          error={error}
          onToggleShuffle={() => setShouldShuffle((prev) => !prev)}
          onStudy={() => {
            setMode('study')
            setScreen('scope')
          }}
          onQuiz={() => {
            setMode('quiz')
            setScreen('scope')
          }}
        />
      )}

      {screen === 'scope' && <ChapterSelect mode={mode} onBack={goHome} onSelect={onScopeSelect} />}

      {screen === 'study' && (
        <StudyScreen
          questions={studyQuestions}
          onStartQuiz={() => startQuiz(scopeChapter)}
          onHome={goHome}
        />
      )}

      {screen === 'quiz' && quiz.current && <QuizScreen quiz={quiz} onExit={goHome} />}

      {screen === 'result' && (
        <ResultScreen
          score={quiz.score}
          total={quiz.total}
          questions={quiz.questions}
          answers={quiz.answers}
          onRetry={() => startQuiz(scopeChapter)}
          onStudyAgain={() => startStudy(scopeChapter)}
          onHome={goHome}
        />
      )}
    </div>
  )
}
