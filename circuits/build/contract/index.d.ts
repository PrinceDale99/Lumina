import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
}

export type ProvableCircuits<PS> = {
}

export type PureCircuits = {
  verifyEmployee(bountyId_0: Uint8Array,
                 companyPubKey_0: Uint8Array,
                 privateKey_0: Uint8Array,
                 corporateSignature_0: Uint8Array,
                 employmentTimestamp_0: bigint,
                 validityThreshold_0: bigint): [boolean, Uint8Array, Uint8Array];
}

export type Circuits<PS> = {
  verifyEmployee(context: __compactRuntime.CircuitContext<PS>,
                 bountyId_0: Uint8Array,
                 companyPubKey_0: Uint8Array,
                 privateKey_0: Uint8Array,
                 corporateSignature_0: Uint8Array,
                 employmentTimestamp_0: bigint,
                 validityThreshold_0: bigint): __compactRuntime.CircuitResults<PS, [boolean,
                                                                                    Uint8Array,
                                                                                    Uint8Array]>;
}

export type Ledger = {
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
