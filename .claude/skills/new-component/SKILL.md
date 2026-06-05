---
name: new-component
description: Scaffold a React function component with a paired CSS module using this project's design tokens. Use when creating a new UI component under src/components.
disable-model-invocation: true
---

# new-component

이 프로젝트의 컴포넌트 컨벤션에 맞춰 `src/components/<Name>.jsx` 와 `src/components/<Name>.module.css` 한 쌍을 생성한다.

## 컨벤션 (반드시 지킬 것)

- 함수형 컴포넌트 + `export default`
- props 는 구조 분해
- 상태 갱신은 불변(immutable) 방식
- CSS Module 사용, 클래스는 camelCase
- 색상/간격은 하드코딩하지 말고 `src/index.css` 의 디자인 토큰 변수 사용
  - 예: `var(--gold)`, `var(--surface)`, `var(--surface-strong)`, `var(--border)`,
    `var(--text)`, `var(--text-muted)`, `var(--radius)`
- 진입 애니메이션이 필요하면 `animation: fadeUp 0.4s ease both;`

## 입력

사용자가 준 인자에서 컴포넌트 이름(PascalCase)을 사용한다. 없으면 물어본다.

## 절차

1. `src/components/<Name>.jsx` 생성:

```jsx
import styles from './<Name>.module.css'

export default function <Name>({ /* props */ }) {
  return <div className={styles.wrap}>{/* ... */}</div>
}
```

2. `src/components/<Name>.module.css` 생성:

```css
.wrap {
  /* 디자인 토큰 사용 예시 */
  background: var(--surface-strong);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
}
```

3. 생성 후 어디에서 import 해 쓸지 한 줄로 안내한다.
4. 코드를 작성/수정했으면 `npm run test:run` 으로 회귀가 없는지 확인을 제안한다.
