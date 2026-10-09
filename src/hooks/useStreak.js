// Streak utility — call on every app load for PREMIUM users only
// Uses LOCAL timezone (not UTC) to avoid off-by-one-day bugs in India (UTC+5:30)

function getLocalDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function computeStreak(progress) {
  if (!progress) {
    return { streakCount: 0, longestStreak: 0, type: null, shouldUpdate: false };
  }

  const today = getLocalDate(0);
  const yesterday = getLocalDate(-1);
  const lastLogin = progress.last_login_date;
  const currentStreak = progress.streak_count || 0;
  const longestStreak = progress.longest_streak || 0;

  // Already logged in today — no update needed
  if (lastLogin === today) {
    return {
      streakCount: currentStreak,
      longestStreak,
      type: null,
      shouldUpdate: false,
    };
  }

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