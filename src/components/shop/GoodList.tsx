import React, { useState } from "react";
import type { CSSProperties } from "react";
import { useShop } from "../../features/shop";

// ✅ 전역 권장: id는 number로 통일
type Id = number;
type GoodsItem = {
  id: Id;
  name: string;
  price: number;
  salePrice?: number;
  image?: string;     // 없으면 자동 플레이스홀더
  badge?: "BEST" | "NEW" | "HOT";
  rating?: number;    // 0~5 (옵션)
};

const rainbow = "linear-gradient(90deg,#ef4444,#f59e0b,#10b981,#06b6d4,#6366f1,#a855f7)";

const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 1040, margin: "32px auto", padding: "0 16px 40px" },
  hero: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    background: "linear-gradient(180deg,#ffffff,#f8fafc)",
    border: "2px solid transparent",
    borderImage: `${rainbow} 1`,
    marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: "-0.01em" },
  heroTag: {
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 900,
    color: "#fff",
    background: "linear-gradient(135deg,#6366f1,#22d3ee)",
  },
  grid: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 14,
  },
};

function card(hovered: boolean): CSSProperties {
  return {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    boxShadow: hovered ? "0 14px 32px rgba(2,6,23,0.14)" : "0 8px 22px rgba(2,6,23,0.08)",
    transform: hovered ? "translateY(-2px)" : "none",
    transition: "transform 160ms ease, box-shadow 160ms ease",
    overflow: "hidden",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
  };
}

function imageBox(src?: string): CSSProperties {
  return src
    ? {
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        paddingTop: "72%", // 4:3 비율
      }
    : {
        background: "linear-gradient(135deg,#e9d5ff,#93c5fd)",
        width: "100%",
        paddingTop: "72%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#111827",
        fontWeight: 900,
        letterSpacing: "-0.01em",
      };
}

const bodyWrap: CSSProperties = { display: "grid", gap: 8, padding: 12 };
const nameStyle: CSSProperties = {
  fontWeight: 900,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const starRow: CSSProperties = { fontSize: 12, color: "#f59e0b", fontWeight: 800 };
const priceRow: CSSProperties = { display: "flex", alignItems: "baseline", gap: 8 };
const priceNow: CSSProperties = { fontSize: 18, fontWeight: 900 };
const priceOld: CSSProperties = { color: "#94a3b8", textDecoration: "line-through", fontWeight: 700 };
const saleBadge: CSSProperties = {
  marginLeft: "auto",
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
  color: "#fff",
  background: "linear-gradient(135deg,#ef4444,#fb923c)",
};
const footer: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: 8,
  padding: 12,
  borderTop: "1px solid #e5e7eb",
};
const meta: CSSProperties = { display: "flex", gap: 8 };
const metaPill: CSSProperties = {
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
  color: "#fff",
  background: "linear-gradient(135deg,#22c55e,#06b6d4)",
};
const btn: CSSProperties = {
  border: 0,
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 900,
  cursor: "pointer",
  color: "#fff",
  background: "linear-gradient(135deg,#6366f1,#22d3ee)",
  boxShadow: "0 6px 14px rgba(99,102,241,0.35)",
};

const toStars = (r?: number) =>
  "★★★★★".slice(0, Math.max(0, Math.min(5, Math.round(r || 0)))) +
  "☆☆☆☆☆".slice(0, 5 - Math.max(0, Math.min(5, Math.round(r || 0))));

const formatWon = (n: number) => n.toLocaleString("ko-KR");
const discount = (price: number, sale?: number) =>
  sale && sale < price ? Math.round(((price - sale) / price) * 100) : 0;

export default function GoodList() {
  // ✅ 컨텍스트 시그니처도 number 기준으로 단정
  const { goods, addCart } = useShop() as {
    goods: GoodsItem[];
    addCart: (id: number) => void;
  };

  const [hoverId, setHoverId] = useState<Id | null>(null);

  return (
    <section style={styles.page}>
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>오늘의 추천 상품</h2>
        <div style={styles.heroTag}>무료배송 · 당일출고</div>
      </div>

      <ul style={styles.grid}>
        {goods.map((item) => {
          const dc = discount(item.price, item.salePrice);
          return (
            <li
              key={item.id}
              style={card(hoverId === item.id)}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <div style={imageBox(item.image)}>
                {!item.image && <span>{item.name?.slice(0, 2) || "GD"}</span>}
              </div>

              <div style={bodyWrap}>
                <div style={nameStyle}>{item.name}</div>
                {item.rating != null && <div style={starRow}>{toStars(item.rating)}</div>}

                <div style={priceRow}>
                  <div style={priceNow}>
                    {formatWon(item.salePrice ?? item.price)} <span style={{ fontSize: 12 }}>원</span>
                  </div>
                  {item.salePrice != null && item.salePrice < item.price && (
                    <>
                      <div style={priceOld}>{formatWon(item.price)} 원</div>
                      {dc > 0 && <span style={saleBadge}>-{dc}%</span>}
                    </>
                  )}
                </div>
              </div>

              <div style={footer}>
                <div style={meta}>
                  {item.badge && <span style={metaPill}>{item.badge}</span>}
                </div>
                {/* ✅ addCart는 number만 받도록 통일 */}
                <button style={btn} onClick={() => addCart(item.id)}>
                  담기
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
