// Streak utility: call on every app load to update streak
export function computeStreak(progress) {
  if (!progress) return { streakCount: 0, longestStreak: 0, type: null };

  const today = new Date().toISOString().slice(0, 10);
  const lastLogin = progress.last_login_date;
  const currentStreak = progress.streak_count || 0;
  const longestStreak = progress.longest_streak || 0;

  if (lastLogin === today) {
    // Already logged in today
    return { streakCount: currentStreak, longestStreak, type: null, shouldUpdate: false };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let newStreak;
  let type;

  if (!lastLogin) {
    // First login ever
    newStreak = 1;
    type = "first";
  } else if (lastLogin === yesterday) {
    // Consecutive day
    newStreak = currentStreak + 1;
    type = newStreak % 7 === 0 ? "milestone" : "continue";
  } else {
    // Streak broken
    newStreak = 1;
    type = currentStreak > 1 ? "reset" : "first";
  }

  const newLongest = Math.max(longestStreak, newStreak);

  return {
    streakCount: newStreak,
    longestStreak: newLongest,
    last_login_date: today,
    type,
    shouldUpdate: true,
  };
}