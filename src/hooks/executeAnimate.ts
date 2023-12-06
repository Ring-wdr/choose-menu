/**
 * 특정 조건이 유지되는 경우 requestAnimationFrame를 계속 호출하는 메서드
 * @param initValue 애니메이션 상태의 초기 값
 * @param step 애니메이션 호출마다 실행될 콜백 함수
 * @param continuableCondition 애니메이션 호출이 지속되는 조건. 생략시 무한 반복된다.
 * @returns 애니메이션 호출을 종료하는 콜백 함수
 */
export default function executeAnimate<T>(
  initValue: T,
  step: (val: T) => T,
  continuableCondition?: (val: T) => boolean
) {
  let closureValue = initValue;
  let animateRef = requestAnimationFrame(animateCallback);
  function animateCallback() {
    closureValue = step(closureValue);
    if (!continuableCondition || continuableCondition(closureValue)) {
      animateRef = requestAnimationFrame(animateCallback);
    }
  }

  return () => cancelAnimationFrame(animateRef);
}
