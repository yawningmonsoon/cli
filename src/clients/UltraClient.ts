import type { Address, Base64EncodedBytes } from "@solana/kit";
import ky from "ky";

type GetOrderRequest = {
  inputMint: string;
  outputMint: string;
  amount: string;
  taker?: string | undefined;
};

export type GetOrderResponse = {
  error?: string | undefined;
  errorCode?: number | undefined;
  errorMessage?: string | undefined;
  requestId: string;
  inAmount: string;
  inUsdValue: number;
  outAmount: string;
  outUsdValue: number;
  otherAmountThreshold: string;
  priceImpact: number;
  taker: string | null;
  transaction: "" | Base64EncodedBytes; // empty string denotes invalid transaction
  router: string;
  platformFee: {
    feeBps: number;
  };
  gasless?: boolean | undefined;
  prioritizationFeePayer?: string | undefined;
  prioritizationFeeLamports?: number | undefined;
  rentFeePayer?: string | undefined;
  rentFeeLamports?: number | undefined;
  signatureFeePayer?: string | undefined;
  signatureFeeLamports?: number | undefined;
};

export type PostExecuteRequest = {
  requestId: string;
  signedTransaction: string;
};

export type PostExecuteResponse = {
  code: number;
  inputAmountResult: string;
  outputAmountResult: string;
  signature: string;
};

export type HoldingsTokenAccount = {
  account: string;
  amount: string;
  uiAmount: number;
  uiAmountString: string;
  isFrozen: boolean;
  isAssociatedTokenAccount: boolean;
  decimals: number;
  programId: string;
};

export type GetHoldingsResponse = {
  amount: string;
  uiAmount: number;
  uiAmountString: string;
  tokens: Record<string, HoldingsTokenAccount[]>;
};

type GetTransferTokenTxRequest = {
  senderAddress: Address;
  senderTokenAccountAddress: Address;
  receiverAddress: Address;
  receiverTokenAccountAddress?: Address; // If present, `receiverAddress` will be ignored and sending to non-initialised ATAs won't work
  amount: string;
  mint: string;
  tokenDecimals: string;
  tokenProgramId: string;
};

type GetTransferSolTxRequest = {
  senderAddress: Address;
  receiverAddress: Address;
  amount: string;
};

type GetTransferTxResponse =
  | {
      requestId: string;
      transaction: string; // base64 encoded wire tx
      expireAt: string;
      feeAmount: number;
      feeUsdAmount: number;
    }
  | {
      error: string;
    };

type PostExecuteTransferRequest = {
  requestId: string;
  signedTransaction: string;
};

type PostExecuteTransferResponse = {
  code: number;
  signature: string;
};

export class UltraClient {
  static readonly #BASE_URL = "https://lite-api.jup.ag/ultra/v1";
  static readonly #ATTRIBUTION_HEADER = {
    "x-client-platform": "jupiter.cli",
  } as const;

  public static async getOrder(
    req: GetOrderRequest
  ): Promise<GetOrderResponse> {
    return ky
      .get(`${this.#BASE_URL}/order`, {
        searchParams: req,
        throwHttpErrors: false,
        headers: this.#ATTRIBUTION_HEADER,
      })
      .json();
  }

  public static async getHoldings(
    address: string
  ): Promise<GetHoldingsResponse> {
    return ky
      .get(`${this.#BASE_URL}/holdings/${address}`, {
        headers: this.#ATTRIBUTION_HEADER,
      })
      .json();
  }

  public static async postExecute(req: PostExecuteRequest) {
    return ky
      .post<PostExecuteResponse>(`${this.#BASE_URL}/execute`, {
        json: req,
        headers: this.#ATTRIBUTION_HEADER,
      })
      .json();
  }

  public static async getTransferTokenTx(
    req: GetTransferTokenTxRequest
  ): Promise<GetTransferTxResponse> {
    return ky
      .get(`${this.#BASE_URL}/transfer/craft-token`, {
        searchParams: req,
        throwHttpErrors: false,
        headers: this.#ATTRIBUTION_HEADER,
      })
      .json();
  }

  public static async getTransferSolTx(
    req: GetTransferSolTxRequest
  ): Promise<GetTransferTxResponse> {
    return ky
      .get(`${this.#BASE_URL}/transfer/craft-native`, {
        searchParams: req,
        throwHttpErrors: false,
        headers: this.#ATTRIBUTION_HEADER,
      })
      .json();
  }

  public static async postExecuteTransfer(
    req: PostExecuteTransferRequest
  ): Promise<PostExecuteTransferResponse> {
    return ky
      .post(`${this.#BASE_URL}/transfer/execute`, {
        json: req,
        headers: this.#ATTRIBUTION_HEADER,
      })
      .json();
  }
}
