import React, { useMemo } from "react";
import type { CSSProperties } from "react";
import { useShop } from "../../features/shop";



// ✅ 전역 권장: id는 number로 통일
type Id = number;
type CartItem = { id: Id; qty: number };
type Goods = { id: Id; name: string; price: number; salePrice?: number; image?: string };

// ✅ styles는 순수 객체만, thumb는 함수로 분리
const thumb = (src?: string): CSSProperties =>
  src
    ? {
        width: 64,
        height: 64,
        borderRadius: 10,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        width: 64,
        height: 64,
        borderRadius: 10,
        background: "linear-gradient(135deg,#93c5fd,#a7f3d0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
      };

const styles: Record<string, CSSProperties> = {
  wrap: { maxWidth: 1040, margin: "32px auto", padding: "0 16px 40px" },
  title: { fontSize: 22, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.01em" },
  board: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 },
  row: {
    display: "grid",
    gridTemplateColumns: "64px 1fr auto auto",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
  },
  name: { fontWeight: 900 },
  qtyBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#f1f5f9",
    borderRadius: 999,
    padding: "6px 10px",
    fontWeight: 900,
  },
  btn: {
    border: 0,
    borderRadius: 999,
    padding: "4px 10px",
    fontWeight: 900,
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
  },
  danger: { background: "linear-gradient(135deg,#fca5a5,#ef4444)" },
  price: { fontWeight: 900 },
  aside: {
    position: "sticky",
    top: 16,
    height: "fit-content",
    background: "linear-gradient(180deg,#ffffff,#f8fafc)",
    border: "2px solid transparent",
    borderImage: "linear-gradient(135deg,#10b981,#34d399) 1",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 26px rgba(2,6,23,0.12)",
    display: "grid",
    gap: 10,
  },
  line: { display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#334155" },
  total: { display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18 },
  cta: {
    marginTop: 6,
    border: 0,
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 900,
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg,#10b981,#34d399)",
    boxShadow: "0 8px 18px rgba(16,185,129,0.35)",
  },
  ghost: {
    border: 0,
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#eef2ff",
    color: "#4338ca",
  },
  empty: {
    gridColumn: "1 / span 2",
    background: "linear-gradient(180deg,#f1f5f9,#ffffff)",
    border: "2px dashed #cbd5e1",
    borderRadius: 12,
    padding: 24,
    textAlign: "center",
    color: "#475569",
    fontWeight: 800,
  },
};

const formatWon = (n: number) => n.toLocaleString("ko-KR");

export default function Cart() {
  const { cart, goods, removeCartOne, resetCart, clearCart, buyAll } = useShop() as {
    cart: CartItem[];
    goods?: Goods[];
    removeCartOne: (id: number) => void;
    resetCart: () => void;
    clearCart: (id: number) => void;
    buyAll: () => void;
  };

  const withInfo = useMemo(() => {
    const list = cart.map((c) => {
      const g = (goods || []).find((x) => x.id === c.id);
      const unit = g?.salePrice ?? g?.price ?? 0;
      return {
        ...c,
        name: g?.name ?? "상품",
        image: g?.image,
        unitPrice: unit,
        line: unit * (c.qty || 0),
      };
    });
    const subtotal = list.reduce((a, v) => a + v.line, 0);
    const totalQty = list.reduce((a, v) => a + (v.qty || 0), 0);
    const shipping = subtotal > 0 ? (subtotal >= 50000 ? 0 : 3000) : 0;
    const total = subtotal + shipping;
    return { list, subtotal, shipping, total, totalQty };
  }, [cart, goods]);

  if (cart.length === 0) {
    return (
      <section style={styles.wrap}>
        <h2 style={styles.title}>장바구니</h2>
        <div style={styles.empty}>장바구니가 비어 있어요. 지금 베스트 상품을 담아보세요! 🛒</div>
      </section>
    );
  }

  return (
    <section style={styles.wrap}>
      <h2 style={styles.title}>장바구니</h2>

      <div style={styles.board}>
        <ul style={styles.list}>
          {withInfo.list.map((item) => (
            <li key={item.id} style={styles.row}>
              <div style={thumb(item.image)}>{!item.image && <span>GD</span>}</div>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={styles.name}>{item.name}</div>
                <div style={{ color: "#64748b", fontWeight: 700 }}>
                  단가: {formatWon(item.unitPrice)} 원
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={styles.qtyBox}>수량: {item.qty}</span>
                <button style={{ ...styles.btn }} onClick={() => removeCartOne(item.id)}>
                  -1
                </button>
                <button style={{ ...styles.btn, ...styles.danger }} onClick={() => clearCart(item.id)}>
                  취소
                </button>
              </div>

              <div style={styles.price}>{formatWon(item.line)} 원</div>
            </li>
          ))}
        </ul>

        <aside style={styles.aside}>
          <div style={styles.line}>
            <span>상품합계</span>
            <span>{formatWon(withInfo.subtotal)} 원</span>
          </div>
          <div style={styles.line}>
            <span>배송비</span>
            <span>{withInfo.shipping === 0 ? "무료" : formatWon(withInfo.shipping) + " 원"}</span>
          </div>
          <div style={styles.total}>
            <span>결제금액</span>
            <span>{formatWon(withInfo.total)} 원</span>
          </div>
          <button style={styles.cta} onClick={buyAll}>
            전체 구매하기 ({withInfo.totalQty}개)
          </button>
          <button style={styles.ghost} onClick={resetCart}>
            전체 취소하기
          </button>
        </aside>
      </div>
    </section>
  );
}
