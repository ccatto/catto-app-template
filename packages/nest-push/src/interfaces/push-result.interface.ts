export interface PushSendResult {
  /** Tokens that were invalid/expired — caller should prune from their storage */
  staleTokens: string[];
}
