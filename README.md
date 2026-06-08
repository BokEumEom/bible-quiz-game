# 🔔 고린도전서 성경 골든벨

고린도전서 1~16장 **100문제**로 푸는 반응형 모바일 성경 퀴즈 앱.
정답을 보며 **학습**한 뒤, 골든벨 방식(문제 → 정답 확인 → 자가 채점)으로 **도전**합니다.

> 출처: 인천은현교회 성경 골든벨 예상문제

---

## ✨ 기능

- **학습 모드** — 문제와 정답을 함께 보며 익히기 (페이지 넘기기, 진행바)
- **객관식 4지선다 자동 채점** — 보기(정답 1 + 오답 3)를 탭하면 즉시 채점, 정답/오답 색으로 표시
- **진도 저장** — localStorage에 장별 최고 정답률 저장, 장 선택 화면에 ⭐/% 마스터리 뱃지
- **성장 지도 + 등급** — 홈에 16장 점등 바와 등급 칭호(새신자→제자→일꾼→전도자→사역자→골든벨 마스터)
- **오답 노트** — 틀린 문제를 자동 누적, 홈에서 오답만 복습. 맞히면 노트에서 자동 제거
- **틀린 문제만 다시** — 결과 화면에서 방금 틀린 문제만 재도전
- **범위 선택** — 전체 100문제 또는 1~16장 장별 선택
- **문제 순서 섞기** 토글
- **결과 화면** — 점수·정답률·등급 메시지 + 전체 문제 다시 보기(○ / ✕ / –)
- **모바일 우선 반응형** — 노치 안전영역 대응, 큰 터치 영역, `prefers-reduced-motion` 존중
- **골든아워 크림 테마** — 밝고 따뜻한 톤, WCAG 대비 충족

## 🧭 화면 흐름

```
홈 ──┬─ 📖 학습하기 ─→ 범위 선택 ─→ 학습 ─→ 문제 풀기 ─→ 결과
     └─ ✏️ 바로 문제 풀기 ─→ 범위 선택 ─→ 문제 풀기 ─→ 결과
```

학습과 퀴즈는 **같은 범위**로 이어집니다. 학습은 원본 순서(1→100), 퀴즈는 순서 섞기 토글을 따릅니다.

## 🚀 시작하기

요구사항: **Node 18+** (개발 환경 Node 22)

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (http://localhost:5173)
```

같은 와이파이의 휴대폰에서 테스트하려면 터미널에 표시되는 **Network** 주소
(예: `http://192.168.x.x:5173`)로 접속하세요. (`host: true` 설정됨)

## 📜 명령어

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (HMR, 폰 접속용 `host: true`) |
| `npm run build` | 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run test` | Vitest 워치 모드 |
| `npm run test:run` | Vitest 1회 실행 |
| `npm run format` | Prettier 포맷 |

## 🗂 프로젝트 구조

```
src/
  data/questions.js     100문제 (id = 원본 문제번호) + 장별 분포
  utils/quiz.js         shuffle · buildQuestionSet · gradeFor (순수 함수)
  hooks/useQuiz.js      퀴즈 한 판 상태 머신 (불변 갱신)
  components/
    HomeScreen          학습 / 바로 풀기 진입
    ChapterSelect       범위 선택 (전체 + 1~16장)
    StudyScreen         학습 (문제+정답 함께 보기)
    QuizScreen          객관식 4지선다 + 자동 채점
    ResultScreen        점수 · 등급 · 다시 보기
  App.jsx               화면 전환 (home → scope → study → quiz → result)
  index.css             디자인 토큰(CSS 변수) + 리셋 + 애니메이션
```

## 🛠 기술 스택

- **React 18** + **Vite 5**
- **framer-motion** — 화면 전환·문제 카드·정답 공개·결과 팝 애니메이션 (움직임 줄이기 자동 존중)
- **CSS Modules** + CSS 변수 디자인 토큰
- **Vitest** + **React Testing Library** (테스트 30개)
- **Pretendard** 웹폰트

## 🎨 디자인

색·간격은 `src/index.css` 의 디자인 토큰(`--gold`, `--surface`, `--text` 등)으로 통일합니다.
골든아워 크림 팔레트: 크림→피치 배경 + 앰버/번트오렌지 강조 + 따뜻한 에스프레소 텍스트.
모든 텍스트는 WCAG 대비 기준을 충족합니다.

## ✅ 테스트

대상 파일 옆에 `*.test.js(x)`. 동작 중심 + 불변성 검증.

```bash
npm run test:run
```

- `utils/quiz.test.js` — 셔플 불변성, 범위 필터, 등급 산정
- `hooks/useQuiz.test.jsx` — 시작·채점·진행·리셋 상태 전이
- `components/StudyScreen.test.jsx` — 학습 화면 탐색

## 📦 빌드 / 배포

```bash
npm run build
```

`dist/` 에 정적 파일이 생성됩니다. 정적 호스팅(Vercel, Netlify, GitHub Pages 등)에 그대로 올리면 됩니다.
