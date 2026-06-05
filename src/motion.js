// 앱 전역에서 재사용하는 framer-motion 변형(variants)·트랜지션.
// MotionConfig reducedMotion="user" 가 움직임 줄이기 설정을 자동 존중한다.

export const spring = { type: 'spring', stiffness: 380, damping: 30 }

// 화면 전환: 좌우로 살짝 밀며 페이드
export const screenVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.26, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.18, ease: 'easeIn' } }
}

// 문제 카드 등장: 아래에서 위로 페이드
export const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } }
}

// 정답 공개: 스프링으로 살짝 튀어오름
export const revealVariants = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: spring }
}

// 리스트 stagger 컨테이너 / 아이템 (장 그리드 등)
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.03 } }
}

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
}

// 버튼 누름 효과
export const tap = { scale: 0.97 }
