import { useState, useEffect } from 'react';

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = (forceState) => {
    if (typeof forceState === 'boolean') {
      setIsFocusMode(forceState);
    } else {
      setIsFocusMode((prev) => !prev);
    }
  };

  return { isFocusMode, toggleFocusMode };
}
