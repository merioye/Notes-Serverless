export interface PolicyOptions {
  principalId: string;
  effect: "Allow" | "Deny";
  resource: string;
}
