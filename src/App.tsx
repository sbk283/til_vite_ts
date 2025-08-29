import type { CSSProperties } from "react";
import React from "react";
import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ShopProvider } from "./features/shop/ShopContext";
import CartPage from "./pages/CartPage";
import GoodsPage from "./pages/GoodsPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import WalletPage from "./pages/WalletPage";

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
const link: CSSProperties = {
  padding: `8px 12px`,
  borderRadius: 8,
  fontSize: 18,
  // border: `1px solid #eee`,
};
const active: CSSProperties = {
  fontWeight: 700,
  textDecoration: "underline",
  backgroundImage: "linear-gradient(90deg,#0ea5e9,#6366f1,#a855f7)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 1px 0 rgba(0,0,0,0.03)",
};
function App() {
  return (
    <Router>
      <div style={header.wrap}>
        <h1 style={header.title}>나의 가게</h1>
      </div>
      <nav style={header.wrap}>
        <NavLink to={"/"} style={link}>
          {({ isActive }) => (
            <span style={isActive ? active : undefined}>홈</span>
          )}
        </NavLink>
        <NavLink to={"/goods"} style={link}>
          {({ isActive }) => (
            <span style={isActive ? active : undefined}>제품목록</span>
          )}
        </NavLink>
        <NavLink to={"/cart"} style={link}>
          {({ isActive }) => (
            <span style={isActive ? active : undefined}>장바구니</span>
          )}
        </NavLink>
        <NavLink to={"/wallet"} style={link}>
          {({ isActive }) => (
            <span style={isActive ? active : undefined}>내 지갑</span>
          )}
        </NavLink>
      </nav>

      <ShopProvider>
        <div style={header.wrap}>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/goods" element={<GoodsPage />}></Route>
            <Route path="/cart" element={<CartPage />}></Route>
            <Route path="/wallet" element={<WalletPage />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </ShopProvider>
    </Router>
  );
}

export default App;
