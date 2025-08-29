# react-router-dom

## 1. 설치

- v7 은 조금 문제가 있어서 v6사용

```bash
npm i react-router-dom@6.30.1
```

## 2. 폴더 및 파일 구조

- `/src/pages` 폴더 생성
- `/src/pages/HomePage.tsx` 파일 생성
  ```tsx
  import React from "react";

  function HomePage() {
    const box: React.CSSProperties = {
      padding: 16,
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      background: "#fafafa",
      marginTop: 12,
      textAlign: "center",
    };
    return (
      <div>
        <div style={box}>
          <h2>환영합니다! 🥸</h2>
          <p>여기는 나의 가게 홈페이지입니다.</p>
        </div>
      </div>
    );
  }

  export default HomePage;
  ```
- `/src/pages/GoodsPage.tsx` 파일 생성
  ```tsx
  import React from "react";
  import GoodList from "../components/shop/GoodList";

  function GoodsPage() {
    return (
      <div>
        <div>
          <GoodList />
        </div>
      </div>
    );
  }

  export default GoodsPage;
  ```
- `/src/pages/CartPage.tsx` 파일 생성
  ```tsx
  import React from "react";
  import Cart from "../contexts/shop/Cart";

  function CartPage() {
    return (
      <div>
        <div>
          <Cart />
        </div>
      </div>
    );
  }

  export default CartPage;
  ```
- `/src/pages/WalletPage.tsx` 파일 생성
  ```tsx
  import React from "react";
  import { Wallet } from "../contexts/shop/Wallet";

  function WalletPage() {
    return (
      <div>
        <Wallet />
      </div>
    );
  }

  export default WalletPage;
  ```
- `/src/pages/NotFound.tsx` 파일 생성
  ```tsx

  ```
