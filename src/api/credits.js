// AI credits are not used in this app (no AI chat / image generation).
export async function getCredits() {
  return { balance: 0 };
}

export async function useCredits() {
  return { success: true, balance: 0 };
}
