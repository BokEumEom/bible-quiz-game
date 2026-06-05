import '@testing-library/jest-dom'

// jsdom 에는 matchMedia 가 없다. framer-motion(MotionConfig reducedMotion="user")이
// 이 값을 읽으므로, 테스트에서는 '움직임 줄이기'를 켠 것으로 보고해 전환을 즉시 끝낸다.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  })
}
