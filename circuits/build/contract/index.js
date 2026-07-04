import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeBytes(64);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

const _descriptor_3 = __compactRuntime.CompactTypeBoolean;

class _tuple_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return [
      _descriptor_3.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0[0]).concat(_descriptor_0.toValue(value_0[1]).concat(_descriptor_0.toValue(value_0[2])));
  }
}

const _descriptor_4 = new _tuple_0();

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      verifyEmployee(context, ...args_1) {
        return { result: pureCircuits.verifyEmployee(...args_1), context };
      }
    };
    this.impureCircuits = {};
    this.provableCircuits = {};
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _verifyEmployee_0(bountyId_0,
                    companyPubKey_0,
                    privateKey_0,
                    corporateSignature_0,
                    employmentTimestamp_0,
                    validityThreshold_0)
  {
    return [employmentTimestamp_0 >= validityThreshold_0,
            companyPubKey_0,
            bountyId_0];
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({ });
export const pureCircuits = {
  verifyEmployee: (...args_0) => {
    if (args_0.length !== 6) {
      throw new __compactRuntime.CompactError(`verifyEmployee: expected 6 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const bountyId_0 = args_0[0];
    const companyPubKey_0 = args_0[1];
    const privateKey_0 = args_0[2];
    const corporateSignature_0 = args_0[3];
    const employmentTimestamp_0 = args_0[4];
    const validityThreshold_0 = args_0[5];
    if (!(bountyId_0.buffer instanceof ArrayBuffer && bountyId_0.BYTES_PER_ELEMENT === 1 && bountyId_0.length === 32)) {
      __compactRuntime.typeError('verifyEmployee',
                                 'argument 1',
                                 'employee.compact line 4 char 1',
                                 'Bytes<32>',
                                 bountyId_0)
    }
    if (!(companyPubKey_0.buffer instanceof ArrayBuffer && companyPubKey_0.BYTES_PER_ELEMENT === 1 && companyPubKey_0.length === 32)) {
      __compactRuntime.typeError('verifyEmployee',
                                 'argument 2',
                                 'employee.compact line 4 char 1',
                                 'Bytes<32>',
                                 companyPubKey_0)
    }
    if (!(privateKey_0.buffer instanceof ArrayBuffer && privateKey_0.BYTES_PER_ELEMENT === 1 && privateKey_0.length === 32)) {
      __compactRuntime.typeError('verifyEmployee',
                                 'argument 3',
                                 'employee.compact line 4 char 1',
                                 'Bytes<32>',
                                 privateKey_0)
    }
    if (!(corporateSignature_0.buffer instanceof ArrayBuffer && corporateSignature_0.BYTES_PER_ELEMENT === 1 && corporateSignature_0.length === 64)) {
      __compactRuntime.typeError('verifyEmployee',
                                 'argument 4',
                                 'employee.compact line 4 char 1',
                                 'Bytes<64>',
                                 corporateSignature_0)
    }
    if (!(typeof(employmentTimestamp_0) === 'bigint' && employmentTimestamp_0 >= 0n && employmentTimestamp_0 <= 4294967295n)) {
      __compactRuntime.typeError('verifyEmployee',
                                 'argument 5',
                                 'employee.compact line 4 char 1',
                                 'Uint<0..4294967296>',
                                 employmentTimestamp_0)
    }
    if (!(typeof(validityThreshold_0) === 'bigint' && validityThreshold_0 >= 0n && validityThreshold_0 <= 4294967295n)) {
      __compactRuntime.typeError('verifyEmployee',
                                 'argument 6',
                                 'employee.compact line 4 char 1',
                                 'Uint<0..4294967296>',
                                 validityThreshold_0)
    }
    return _dummyContract._verifyEmployee_0(bountyId_0,
                                            companyPubKey_0,
                                            privateKey_0,
                                            corporateSignature_0,
                                            employmentTimestamp_0,
                                            validityThreshold_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
