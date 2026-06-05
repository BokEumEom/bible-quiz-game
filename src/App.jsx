import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { useQuiz } from './hooks/useQuiz'
import { buildQuestionSet, questionsByIds } from './utils/quiz'
import { getProgress, getWrongIds, recordResult, updateWrongNote } from './utils/storage'
import { screenVariants } from './motion'
import HomeScreen from './components/HomeScreen'
import ChapterSelect from './components/ChapterSelect'
import StudyScreen from './components/StudyScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import styles from './App.module.css'

// 화면 흐름:
//   home → scope → study → quiz → result   (학습하기)
//   home → scope → quiz → result           (바로 문제 풀기)
//   home → quiz(오답노트) → result          (오답 복습)
export default function App() {
  const [screen, setScreen] = useState('home')
  const [mode, setMode] = useState('study') // 범위 선택이 이어질 행동
  const [shouldShuffle, setShouldShuffle] = useState(false)
  const [scopeChapter, setScopeChapter] = useState(null) // null = 전체
  const [scopeKind, setScopeKind] = useState('all') // 'all' | 'chapter' | 'wrong'
  const [studyQuestions, setStudyQuestions] = useState([])
  const [error, setError] = useState(null)

  // localStorage 스토어 (마운트 시 로드)
  const [progress, setProgress] = useState(() => getProgress())
  const [wrongIds, setWrongIds] = useState(() => getWrongIds())

  const quiz = useQuiz()
  const recordedRef = useRef(false) // 한 판당 한 번만 기록

  // 퀴즈 종료 → 기록 + 오답노트 갱신 + 결과 화면
  useEffect(() => {
    if (screen !== 'quiz' || !quiz.isFinished || recordedRef.current) return
    recordedRef.current = true

    const wrong = quiz.questions.filter((q) => quiz.answers[q.id] === 'wrong').map((q) => q.id)
    const corrected = quiz.questions
      .filter((q) => quiz.answers[q.id] === 'correct')
      .map((q) => q.id)

    // 오답노트/틀린것만 재도전은 진도(최고점)에 반영하지 않는다
    if (scopeKind !== 'wrong') {
      setProgress(recordResult(scopeChapter, quiz.score.correct, quiz.total))
    }
    setWrongIds(updateWrongNote(wrong, corrected))
    setScreen('result')
  }, [
    screen,
    quiz.isFinished,
    quiz.questions,
    quiz.answers,
    quiz.score,
    quiz.total,
    scopeChapter,
    scopeKind
  ])

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

  const startQuizScope = useCallback(
    (chapter) => {
      const ok = quiz.start({ chapter, shouldShuffle })
      if (ok) {
        setScopeChapter(chapter)
        setScopeKind(chapter === null ? 'all' : 'chapter')
        recordedRef.current = false
        setScreen('quiz')
      }
    },
    [quiz, shouldShuffle]
  )

  const startWrongQuiz = useCallback(
    (ids) => {
      const set = questionsByIds(ids)
      if (set.length === 0) return
      const ok = quiz.start({ questions: set })
      if (ok) {
        setScopeKind('wrong')
        recordedRef.current = false
        setScreen('quiz')
      }
    },
    [quiz]
  )

  const onScopeSelect = useCallback(
    (chapter) => {
      if (mode === 'study') startStudy(chapter)
      else startQuizScope(chapter)
    },
    [mode, startStudy, startQuizScope]
  )

  const goHome = useCallback(() => {
    quiz.reset()
    setStudyQuestions([])
    setError(null)
    setProgress(getProgress())
    setWrongIds(getWrongIds())
    setScreen('home')
  }, [quiz])

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            shouldShuffle={shouldShuffle}
            error={error}
            progress={progress}
            wrongCount={wrongIds.length}
            onToggleShuffle={() => setShouldShuffle((prev) => !prev)}
            onStudy={() => {
              setMode('study')
              setScreen('scope')
            }}
            onQuiz={() => {
              setMode('quiz')
              setScreen('scope')
            }}
            onReviewWrong={() => startWrongQuiz(wrongIds)}
          />
        )
      case 'scope':
        return (
          <ChapterSelect mode={mode} progress={progress} onBack={goHome} onSelect={onScopeSelect} />
        )
      case 'study':
        return (
          <StudyScreen
            questions={studyQuestions}
            onStartQuiz={() => startQuizScope(scopeChapter)}
            onHome={goHome}
          />
        )
      case 'quiz':
        return quiz.current ? (
          <QuizScreen quiz={quiz} isReview={scopeKind === 'wrong'} onExit={goHome} />
        ) : null
      case 'result':
        return (
          <ResultScreen
            score={quiz.score}
            total={quiz.total}
            questions={quiz.questions}
            answers={quiz.answers}
            isReview={scopeKind === 'wrong'}
            onRetry={() => startQuizScope(scopeChapter)}
            onRetryWrong={(ids) => startWrongQuiz(ids)}
            onStudyAgain={() => startStudy(scopeChapter)}
            onHome={goHome}
          />
        )
      default:
        return null
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.shell}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            className={styles.screen}
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
