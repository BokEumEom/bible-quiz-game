# 고린도전서 성경 골든벨

React 18 + Vite 5 로 만든 반응형 모바일 성경 퀴즈 앱. 고린도전서 1~16장 100문제를
골든벨(문제 보기 → 정답 확인 → 자가 채점) 방식으로 푼다.

## 명령어

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (폰 접속용 `host: true`, 포트 5173) |
| `npm run build` | 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run test` | Vitest 워치 모드 |
| `npm run test:run` | Vitest 1회 실행 (CI/검증용) |
| `npm run format` | Prettier 포맷 |

## 구조

```
src/
  data/questions.js     100문제 (id = PDF 문제번호), CHAPTERS 분포
  utils/quiz.js         shuffle · buildQuestionSet · gradeFor (순수 함수)
  hooks/useQuiz.js      퀴즈 한 판 상태 머신 (불변 갱신)
  components/           Home / ChapterSelect / Quiz / Result + 각 .module.css
  App.jsx               화면 전환 (home → chapter → quiz → result)
  index.css             디자인 토큰(CSS 변수) + 리셋 + 애니메이션
```

## 컨벤션

- **불변성**: 상태/배열 절대 직접 변경 금지, 항상 새 객체 반환
- **작은 파일**: 컴포넌트 + 짝꿍 `.module.css`, 200~400줄 기준
- **디자인 토큰**: 색·간격은 `src/index.css` 의 `var(--*)` 사용 (하드코딩 금지)
- **한글 줄바꿈**: 긴 텍스트엔 `word-break: keep-all`
- **접근성**: 장식 이모지 `aria-hidden`, 토글 `aria-pressed`, 터치 타깃 ≥44px
- **모션**: `prefers-reduced-motion` 존중

## 자동화 (.claude/)

- **hook (PreToolUse)**: `dist/`·`node_modules/` 직접 편집 차단 → 항상 `src/` 수정
- **skill `/new-component`**: 컨벤션대로 컴포넌트+CSS 모듈 스캐폴딩
- **agent `ui-reviewer`**: 접근성/반응형 리뷰 (읽기 전용)
- **agent `test-writer`**: Vitest 테스트 생성·실행

## 테스트

대상 파일 옆에 `*.test.js(x)`. 동작 중심 + 불변성 검증. 기존 예시:
`src/utils/quiz.test.js`, `src/hooks/useQuiz.test.jsx`.
