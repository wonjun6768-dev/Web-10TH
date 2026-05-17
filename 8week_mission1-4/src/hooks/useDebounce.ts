import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 value를 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup 함수: value나 delay가 변경되거나 컴포넌트가 언마운트될 때 실행
    // 이전에 설정된 타이머를 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value나 delay가 변경될 때마다 useEffect 재실행

  return debouncedValue;
}

export default useDebounce;
