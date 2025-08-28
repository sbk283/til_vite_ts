import React from "react";
import type { CSSProperties } from "react";
import GoodList from "./components/shop/GoodList";
import Cart from "./contexts/shop/Cart";
import { Wallet } from "./contexts/shop/Wallet";
import { ShopProvider } from "./features/shop/ShopContext";

const header: Record<string, CSSProperties> = {
  wrap: { maxWidth: 1040, margin: "16px auto 8px", padding: "0 16px" },
  title: {
    margin: "12px 0 8px",
    fontSize: 32,
    lineHeight: 1.15,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    backgroundImage: "linear-gradient(90deg,#0ea5e9,#6366f1,#a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    // 선택: 기본 컬러 폴백이 필요하면 아래 한 줄 주석 해제
    // color: "#0f172a",
    textShadow: "0 1px 0 rgba(0,0,0,0.03)",
    display: "inline-block",
  },
  bar: {
    width: 120,
    height: 8,
    borderRadius: 999,
    background: "linear-gradient(90deg,#22c55e,#06b6d4,#6366f1)",
  },
  // 선택: 작은 태그라인(원하면 사용)
  tagline: { marginTop: 8, color: "#475569", fontWeight: 700 },
};

function App() {
  return (
    <ShopProvider>
      <div>
        <div style={header.wrap}>
          <h1 style={header.title}>나의 가게</h1>
          <div style={header.bar} />
          {/* <div style={header.tagline}>무료배송 · 오늘의 특가 진행 중</div> */}
        </div>

        <div>
          <GoodList />
          <Cart />
          <Wallet />
        </div>
      </div>
    </ShopProvider>
  );
}

export default App;
