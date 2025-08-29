/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: string;

  readonly VITE_ALGOD_TOKEN: string;
  readonly VITE_ALGOD_SERVER: string;
  readonly VITE_ALGOD_PORT: string;
  readonly VITE_ALGOD_NETWORK: string;

  readonly VITE_INDEXER_TOKEN: string;
  readonly VITE_INDEXER_SERVER: string;
  readonly VITE_INDEXER_PORT: string;

  readonly VITE_NODELY_STATS: string;
  readonly VITE_ALGORAND_FOUNDATION_STATS: string;

  readonly VITE_EXPLORER_ACCOUNT_URL: string;
  readonly VITE_EXPLORER_TRANSACTION_URL: string;
  readonly VITE_EXPLORER_ASSET_URL: string;
  readonly VITE_EXPLORER_APPLICATION_URL: string;

  readonly VITE_RATE_MIN_TIME: string;
  readonly VITE_RATE_MAX_CONCURRENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
