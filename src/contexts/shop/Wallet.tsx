import React from "react";
import type { CSSProperties } from "react";
import { useShop } from "../../features/shop";

const styles: Record<string, CSSProperties> = {
  wrap: { maxWidth: 1040, margin: "0 auto 12px", padding: "0 16px" },
  banner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg,#ffffff,#f8fafc)",
    border: "2px solid transparent",
    borderImage: "linear-gradient(135deg,#22c55e,#06b6d4) 1",
    boxShadow: "0 10px 24px rgba(2,6,23,0.12)",
    fontWeight: 900,
  },
  left: { display: "flex", alignItems: "center", gap: 10 },
  dot: {
    width: 10, height: 10, borderRadius: 999,
    background: "linear-gradient(135deg,#22c55e,#06b6d4)",
  },
  amount: { fontSize: 18 },
};

const formatWon = (n: number) => n.toLocaleString("ko-KR");

export function Wallet() {
  const { balance } = useShop();
  return (
    <div style={styles.wrap}>
      <div style={styles.banner}>
        <div style={styles.left}>
          <div style={styles.dot} />
          <div>Wallet</div>
        </div>
        <div style={styles.amount}>잔액 · {formatWon(balance)}원</div>
      </div>
    </div>
  );
}
