// 공통: 숫자를 원화로 포맷팅
export const formatWon = (num: number) =>
  typeof num === "number" ? num.toLocaleString("ko-KR") : String(num);

// 공통: 테마 토큰
export const theme = {
  radius: 16,
  radiusSm: 12,
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  surface: "#ffffff",
  surfaceSub: "#f8fafc",
  border: "1px solid rgba(2,6,23,0.06)",
  shadowSm: "0 4px 16px rgba(2,6,23,0.06)",
  shadowMd: "0 6px 24px rgba(2,6,23,0.08)",
  shadowLg: "0 10px 32px rgba(2,6,23,0.12)",
  gradBrand: "linear-gradient(135deg, #0ea5e9, #6366f1)",
  gradAccent: "linear-gradient(135deg, #10b981, #34d399)",
  gradWarn: "linear-gradient(135deg, #f59e0b, #f97316)",
} as const;
