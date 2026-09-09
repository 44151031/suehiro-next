"use client";

import { createContext } from "react";

export const ShopSupportContext = createContext<
  ((shopid: string, likes: number, liked: boolean) => void) | null
>(null);
