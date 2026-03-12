import { address } from "@solana/kit";

export const Mint = {
  WSOL: address("So11111111111111111111111111111111111111112"),
} as const;
export type Mint = (typeof Mint)[keyof typeof Mint];
