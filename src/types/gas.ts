export interface GasCalculation {
  gasLimit: bigint;
  gasCost: bigint;
  details: string[];
}

export interface FormattedGasEstimate {
  gasLimit: string;
  gasCost: string;
  gasPrice: string;
}

export interface GasEstimationResult {
  estimate: FormattedGasEstimate | null;
  details: string[];
  error: string | null;
}