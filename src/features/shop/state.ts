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