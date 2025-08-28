# Context API와 useReduce 예제

- 시나리오
  - 쇼핑몰 장바구니, 잔액 관리

## 1. 폴더 및 파일 구조

- /src/contexts/shop 폴더 생성
- /src/contexts/shop/ShopContext.tsx 파일 생성

```tsx
import React, { createContext, useContext, useReducer } from 'react';

// 1. 초기값
type CartType = { id: number; qty: number };
type GoodType = {
  id: number;
  name: string;
  price: number;
};
type ShopStateType = {
  balance: number;
  cart: CartType[];
  goods: GoodType[];
};
const initialState: ShopStateType = {
  balance: 100000,
  cart: [],
  goods: [
    { id: 1, name: '사과', price: 1000 },
    { id: 2, name: '딸기', price: 30000 },
    { id: 3, name: '바나나', price: 500 },
    { id: 4, name: '초코렛', price: 8000 },
  ],
};
// 2. 리듀서
enum ShopActionType {
  ADD_CART = 'ADD_CART',
  REMOVE_CART_ONE = 'REMOVE_CART',
  CLEAR_CART_ITEM = 'CLEAR_CART',
  BUY_ALL = 'BUY_ALL',
  RESET = 'RESET',
}
type ShopActionAddCart = { type: ShopActionType.ADD_CART; payload: { id: number } };
type ShopActionRemoveCart = { type: ShopActionType.REMOVE_CART_ONE; payload: { id: number } };
type ShopActionClearCart = { type: ShopActionType.CLEAR_CART_ITEM; payload: { id: number } };
type ShopActionBuyAll = { type: ShopActionType.BUY_ALL };
type ShopActionReset = { type: ShopActionType.RESET };
type ShopAction =
  | ShopActionAddCart
  | ShopActionRemoveCart
  | ShopActionClearCart
  | ShopActionReset
  | ShopActionBuyAll;

// 장바구니 전체 금액계산하기
// 장바구니 전체 금액 계산하기
function calcCart(nowState: ShopStateType): number {
  const total = nowState.cart.reduce((sum, 장바구니제품) => {
    // id를 이용해서 제품 상세 정보 찾기
    const good = nowState.goods.find(g => g.id === 장바구니제품.id);
    if (good) {
      return sum + good.price * 장바구니제품.qty; // 반드시 return
    }
    return sum; // good이 없으면 그대로 반환
  }, 0);

  return total;
}

function reducer(state: ShopStateType, action: ShopAction) {
  switch (action.type) {
    case ShopActionType.ADD_CART: {
      const { id } = action.payload; // 제품의 ID
      // id 제품이 배열에 있는가? qty 가 있는가?
      const existGood = state.cart.find(item => item.id === id);
      let arr: CartType[] = [];
      if (existGood) {
        // qty 증가
        arr = state.cart.map(item => (item.id === id ? { ...item, qty: item.qty + 1 } : item));
      } else {
        // state.cart 에 새 제품 추가, qty 는 1개
        arr = [...state.cart, { id: id, qty: 1 }];
      }
      return { ...state, cart: arr };
    }
    case ShopActionType.REMOVE_CART_ONE: {
      const { id } = action.payload; // 1개 빼줄 제품의 ID
      // id 제품이 배열에 있는가? qty 가 있는가?
      const existGood = state.cart.find(item => item.id === id);

      if (!existGood) {
        // 제품이 없다면...
        return state;
      }

      let arr: CartType[] = [];
      if (existGood.qty > 1) {
        // 제품이 최소 2개 이상이면
        arr = state.cart.map(item => (item.id === id ? { ...item, qty: item.qty - 1 } : item));
      } else {
        // 제품이 1개
        arr = state.cart.filter(item => item.id !== id);
      }

      return { ...state, cart: arr };
    }
    case ShopActionType.CLEAR_CART_ITEM: {
      // 담겨진 제품 중에 장바구니에서 제거하기
      const { id } = action.payload;
      const arr = state.cart.filter(item => item.id !== id);
      return { ...state, cart: arr };
    }
    case ShopActionType.BUY_ALL: {
      // 총 금액계산
      const total = calcCart(state);
      if (total > state.balance) {
        alert('돈이 부족합니다. 장바구니를 줄이세요');
        return state;
      }
      return { ...state, balance: state.balance - total, cart: [] };
    }
    case ShopActionType.RESET:
      return initialState;
    default:
      return state;
  }
}
// 3. 컨텍스트 생성
type ShopValueType = {
  cart: CartType[];
  goods: GoodType[];
  balance: number;
  addCart: (id: number) => void;
  removeCartOne: (id: number) => void;
  clearCart: (id: number) => void;
  buyAll: () => void;
  resetCart: () => void;
};
const ShopContext = createContext<ShopValueType | null>(null);
// 4. 프로바이더
export const ShopProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // dispatch 용 함수 표현식
  const addCart = (id: number): void => {
    dispatch({ type: ShopActionType.ADD_CART, payload: { id } });
  };
  const removeCartOne = (id: number): void => {
    dispatch({ type: ShopActionType.REMOVE_CART_ONE, payload: { id } });
  };
  const clearCart = (id: number): void => {
    dispatch({ type: ShopActionType.CLEAR_CART_ITEM, payload: { id } });
  };
  const buyAll = (): void => {
    dispatch({ type: ShopActionType.BUY_ALL });
  };
  const resetCart = (): void => {
    dispatch({ type: ShopActionType.RESET });
  };

  const value: ShopValueType = {
    cart: state.cart,
    goods: state.goods,
    balance: state.balance,
    addCart,
    removeCartOne,
    clearCart,
    buyAll,
    resetCart,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
// 5. 커스텀 훅
export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error('Shop 컨텍스트가 생성되지 않았습니다.');
  }
  return ctx;
}
```

- /src/components/shop 폴더 생성
- /src/components/shop/GoodList.tsx 파일 생성

```tsx
import React, { useState } from "react";
import type { CSSProperties } from "react";
import { useShop } from "../../contexts/shop/ShopContext";

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

```

- /src/components/shop/Cart.tsx 파일 생성

```tsx
import React, { useMemo } from "react";
import type { CSSProperties } from "react";
import { useShop } from "./ShopContext";

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

```

- /src/components/shop/Wallet.tsx 파일 생성

```tsx
import React from "react";
import type { CSSProperties } from "react";
import { useShop } from "./ShopContext";

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

```

- App.tsx 수정

```tsx
import React from "react";
import type { CSSProperties } from "react";
import GoodList from "./components/shop/GoodList";
import Cart from "./contexts/shop/Cart";
import { Wallet } from "./contexts/shop/Wallet";
import { ShopProvider } from "./contexts/shop/ShopContext";

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

```

## 2. 실전 파일 분리하기

### 2.1. 폴더 및 파일 구조
- 기능별로 분리한다면 contexts 말고 `features` 폴더를 만든다.
- `/src/features/shop` 폴더 생성
- `/src/features/shop/types.ts` 파일 생성
```ts
// 장바구니 아이템 타입
export type CartType = {
  id: number;
  qty: number;
};
export type GoodType = {
  id: number;
  name: string;
  price: number;
};
// Shop State 타입
export type ShopStateType = {
  balance: number;
  cart: CartType[];
  goods: GoodType[];
};
// Action 타입
export enum ShopActionType {
  ADD_CART = 'ADD_CART',
  REMOVE_CART_ONE = 'REMOVE_CART',
  CLEAR_CART_ITEM = 'CLEAR_CART',
  BUY_ALL = 'BUY_ALL',
  RESET = 'RESET',
}
export type ShopActionAddCart = { type: ShopActionType.ADD_CART; payload: { id: number } };
export type ShopActionRemoveCart = { type: ShopActionType.REMOVE_CART_ONE; payload: { id: number } };
export type ShopActionClearCart = { type: ShopActionType.CLEAR_CART_ITEM; payload: { id: number } };
export type ShopActionBuyAll = { type: ShopActionType.BUY_ALL };
export type ShopActionReset = { type: ShopActionType.RESET };
export type ShopAction =
  | ShopActionAddCart
  | ShopActionRemoveCart
  | ShopActionClearCart
  | ShopActionReset
  | ShopActionBuyAll;
// Provider 의 Value 타입
export type ShopValueType = {
  cart: CartType[];
  goods: GoodType[];
  balance: number;
  addCart: (id: number) => void;
  removeCartOne: (id: number) => void;
  clearCart: (id: number) => void;
  buyAll: () => void;
  resetCart: () => void;
};

```
- `/src/features/shop/state.ts` 파일 생성
```ts
import type { ShopStateType } from "./types";

export const initialState: ShopStateType = {
  balance: 100000,
  cart: [],
  goods: [
    { id: 1, name: '사과', price: 1000 },
    { id: 2, name: '딸기', price: 30000 },
    { id: 3, name: '바나나', price: 500 },
    { id: 4, name: '초코렛', price: 8000 },
    { id: 5, name: '오랜지', price: 15000 },
    { id: 6, name: '황금', price: 100001 },
    { id: 7, name: '사지마세요', price: 500000 },
    { id: 8, name: '어짜피못사요', price: 100000000 },
    { id: 9, name: '못산다니까요', price: 999999999 },
  ],
};
```
- `/src/features/shop/utils.ts` 파일 생성
```ts
// 장바구니 전체 금액계산하기

import type { CartType, GoodType } from "./types";

// 총액 계산 함수 (state 대신 cart, goods만 받도록)
export function calcTotal(cart: CartType[], goods: GoodType[]): number {
  return cart.reduce((sum, c) => {
    const good = goods.find(g => g.id === c.id);
    return good ? sum + good.price * c.qty : sum;
  }, 0);
}
```
- `/src/features/shop/reducer.ts` 파일 생성
```ts
import { initialState } from "./state";
import { ShopActionType, type CartType, type ShopAction, type ShopStateType } from "./types";
import { calcTotal } from "./utils";

export function reducer(state: ShopStateType, action: ShopAction) {
  switch (action.type) {
    case ShopActionType.ADD_CART: {
      const { id } = action.payload; // 제품의 ID
      // id 제품이 배열에 있는가? qty 가 있는가?
      const existGood = state.cart.find(item => item.id === id);
      let arr: CartType[] = [];
      if (existGood) {
        // qty 증가
        arr = state.cart.map(item => (item.id === id ? { ...item, qty: item.qty + 1 } : item));
      } else {
        // state.cart 에 새 제품 추가, qty 는 1개
        arr = [...state.cart, { id: id, qty: 1 }];
      }
      return { ...state, cart: arr };
    }
    case ShopActionType.REMOVE_CART_ONE: {
      const { id } = action.payload; // 1개 빼줄 제품의 ID
      // id 제품이 배열에 있는가? qty 가 있는가?
      const existGood = state.cart.find(item => item.id === id);

      if (!existGood) {
        // 제품이 없다면...
        return state;
      }

      let arr: CartType[] = [];
      if (existGood.qty > 1) {
        // 제품이 최소 2개 이상이면
        arr = state.cart.map(item => (item.id === id ? { ...item, qty: item.qty - 1 } : item));
      } else {
        // 제품이 1개
        arr = state.cart.filter(item => item.id !== id);
      }

      return { ...state, cart: arr };
    }
    case ShopActionType.CLEAR_CART_ITEM: {
      // 담겨진 제품 중에 장바구니에서 제거하기
      const { id } = action.payload;
      const arr = state.cart.filter(item => item.id !== id);
      return { ...state, cart: arr };
    }
    case ShopActionType.BUY_ALL: {
      // 총 금액계산
      const total = calcTotal(state.cart, state.goods);
      if (total > state.balance) {
        alert('돈이 부족합니다. 장바구니를 줄이세요');
        return state;
      }
      return { ...state, balance: state.balance - total, cart: [] };
    }
    case ShopActionType.RESET:
      return initialState;
    default:
      return state;
  }
}
```
- `/src/features/shop/ShopContext.tsx` 파일 생성
```tsx
import React, { createContext, useReducer } from "react";
import { ShopActionType, type ShopValueType } from "./types";
import { reducer } from "./reducer";
import { initialState } from "./state";


export const ShopContext = createContext<ShopValueType | null>(null);

// 4. 프로바이더
export const ShopProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // dispatch 용 함수 표현식
  const addCart = (id: number): void => {
    dispatch({ type: ShopActionType.ADD_CART, payload: { id } });
  };
  const removeCartOne = (id: number): void => {
    dispatch({ type: ShopActionType.REMOVE_CART_ONE, payload: { id } });
  };
  const clearCart = (id: number): void => {
    dispatch({ type: ShopActionType.CLEAR_CART_ITEM, payload: { id } });
  };
  const buyAll = (): void => {
    dispatch({ type: ShopActionType.BUY_ALL });
  };
  const resetCart = (): void => {
    dispatch({ type: ShopActionType.RESET });
  };

  const value: ShopValueType = {
    cart: state.cart,
    goods: state.goods,
    balance: state.balance,
    addCart,
    removeCartOne,
    clearCart,
    buyAll,
    resetCart,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
```

- `/src/features/shop/hooks` 폴더 생성
- `/src/features/shop/hooks/useShop.ts` 파일 생성
```ts
import { useContext } from "react";
import { ShopContext } from "../ShopContext";

// 5. 커스텀 훅
export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error('Shop 컨텍스트가 생성되지 않았습니다.');
  }
  return ctx;
}
```
- `/src/features/shop/hooks/useShopSelectors.ts` 파일 생성
```ts
import { calcTotal } from "../utils";
import { useShop } from "./useShop";

// 6. 추가 커스텀 훅 : 상품 찾기, 총액
export function useShopSelectors() {
  const { goods, cart } = useShop();
  // 제품 한개 정보 찾기
  const getGood = (id: number) => goods.find(item => item.id === id);
  // 총 금액
  const total = calcTotal(cart, goods);
  // 리턴
  return { getGood, total };
}

```

### 2.2. `배럴 파일` 활용하기
- 여러 모듈에서 내보낸 것들을 모아서 하나의 파일에서 다시 내보내는 패턴
- 주로 index.js 나 index.ts 로 파일명을 정한다.
- 즉 `대표 파일`이라고 한다.
- `/src/features/shop/index.ts` 파일 생성
```ts
export * from './types';
// 아래의 경우는 충돌 발생 소지 있음.
export { initialState } from './state';
export { calcTotal } from './utils';
// 아래의 경우는 충돌 발생 소지 있음.
export { reducer } from './reducer';
export { ShopContext, ShopProvider } from './ShopContext';
export { useShop } from './hooks/useShop';
export { useShopSelectors } from './hooks/useShopSelectors';
```