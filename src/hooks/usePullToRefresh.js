import { useState, useRef } from "react";

export function usePullToRefresh(onRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!touchStartY.current) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 60 && !refreshing && window.scrollY === 0) {
      setRefreshing(true);
      touchStartY.current = null;
      onRefresh().finally(() => setRefreshing(false));
    }
  };

  return {
    refreshing,
    touchHandlers: { onTouchStart: handleTouchStart, onTouchMove: handleTouchMove },
  };
}