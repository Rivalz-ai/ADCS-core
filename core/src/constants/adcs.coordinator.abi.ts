export const ADCS_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'have',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'want',
        type: 'uint256'
      }
    ],
    name: 'GasLimitTooBig',
    type: 'error'
  },
  {
    inputs: [],
    name: 'IncompatibleJobId',
    type: 'error'
  },
  {
    inputs: [],
    name: 'IncorrectCommitment',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'have',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'want',
        type: 'uint256'
      }
    ],
    name: 'InsufficientPayment',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'accId',
        type: 'uint64'
      },
      {
        internalType: 'address',
        name: 'consumer',
        type: 'address'
      }
    ],
    name: 'InvalidConsumer',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidJobId',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidNumSubmission',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NoCorrespondingRequest',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'NoSuchOracle',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotRequestOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'OracleAlreadyRegistered',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OracleAlreadySubmitted',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'OwnableInvalidOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Reentrant',
    type: 'error'
  },
  {
    inputs: [],
    name: 'RefundFailure',
    type: 'error'
  },
  {
    inputs: [],
    name: 'TooManyOracles',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'UnregisteredOracleFulfillment',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'maxGasLimit',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'gasAfterPaymentCalculation',
        type: 'uint256'
      }
    ],
    name: 'ConfigSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'response',
        type: 'bytes'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      }
    ],
    name: 'DataRequestFulfilled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'response',
        type: 'bool'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      }
    ],
    name: 'DataRequestFulfilledBool',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'response',
        type: 'bytes'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      }
    ],
    name: 'DataRequestFulfilledBytes',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'response',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      }
    ],
    name: 'DataRequestFulfilledBytes32',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'bool',
            name: 'response',
            type: 'bool'
          }
        ],
        indexed: false,
        internalType: 'struct IADCSCoordinatorBase.StringAndBool',
        name: 'response',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      }
    ],
    name: 'DataRequestFulfilledStringAndBool',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'response',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      }
    ],
    name: 'DataRequestFulfilledUint256',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'callbackGasLimit',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'jobId',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'DataRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      }
    ],
    name: 'DataSubmitted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'OracleDeregistered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'OracleRegistered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'prepayment',
        type: 'address'
      }
    ],
    name: 'PrepaymentSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      }
    ],
    name: 'RequestCanceled',
    type: 'event'
  },
  {
    inputs: [],
    name: 'MAX_ORACLES',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      }
    ],
    name: 'cancelRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'deregisterOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'response',
        type: 'bool'
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'blockNum',
            type: 'uint64'
          },
          {
            internalType: 'uint256',
            name: 'callbackGasLimit',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address'
          },
          {
            internalType: 'bytes32',
            name: 'jobId',
            type: 'bytes32'
          }
        ],
        internalType: 'struct IADCSCoordinatorBase.RequestCommitment',
        name: 'rc',
        type: 'tuple'
      }
    ],
    name: 'fulfillDataRequestBool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'response',
        type: 'bytes'
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'blockNum',
            type: 'uint64'
          },
          {
            internalType: 'uint256',
            name: 'callbackGasLimit',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address'
          },
          {
            internalType: 'bytes32',
            name: 'jobId',
            type: 'bytes32'
          }
        ],
        internalType: 'struct IADCSCoordinatorBase.RequestCommitment',
        name: 'rc',
        type: 'tuple'
      }
    ],
    name: 'fulfillDataRequestBytes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        internalType: 'bytes32',
        name: 'response',
        type: 'bytes32'
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'blockNum',
            type: 'uint64'
          },
          {
            internalType: 'uint256',
            name: 'callbackGasLimit',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address'
          },
          {
            internalType: 'bytes32',
            name: 'jobId',
            type: 'bytes32'
          }
        ],
        internalType: 'struct IADCSCoordinatorBase.RequestCommitment',
        name: 'rc',
        type: 'tuple'
      }
    ],
    name: 'fulfillDataRequestBytes32',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'bool',
            name: 'response',
            type: 'bool'
          }
        ],
        internalType: 'struct IADCSCoordinatorBase.StringAndBool',
        name: 'response',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'blockNum',
            type: 'uint64'
          },
          {
            internalType: 'uint256',
            name: 'callbackGasLimit',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address'
          },
          {
            internalType: 'bytes32',
            name: 'jobId',
            type: 'bytes32'
          }
        ],
        internalType: 'struct IADCSCoordinatorBase.RequestCommitment',
        name: 'rc',
        type: 'tuple'
      }
    ],
    name: 'fulfillDataRequestStringAndBool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'response',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'blockNum',
            type: 'uint64'
          },
          {
            internalType: 'uint256',
            name: 'callbackGasLimit',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address'
          },
          {
            internalType: 'bytes32',
            name: 'jobId',
            type: 'bytes32'
          }
        ],
        internalType: 'struct IADCSCoordinatorBase.RequestCommitment',
        name: 'rc',
        type: 'tuple'
      }
    ],
    name: 'fulfillDataRequestUint256',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      }
    ],
    name: 'getCommitment',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        internalType: 'uint256',
        name: 'maxGasLimit',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'gasAfterPaymentCalculation',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'isOracleRegistered',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'consumer',
        type: 'address'
      },
      {
        internalType: 'uint64',
        name: 'nonce',
        type: 'uint64'
      }
    ],
    name: 'pendingRequestExists',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'registerOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'callbackGasLimit',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'id',
            type: 'bytes32'
          },
          {
            internalType: 'address',
            name: 'callbackAddr',
            type: 'address'
          },
          {
            internalType: 'bytes4',
            name: 'callbackFunc',
            type: 'bytes4'
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'bytes',
                name: 'buf',
                type: 'bytes'
              },
              {
                internalType: 'uint256',
                name: 'capacity',
                type: 'uint256'
              }
            ],
            internalType: 'struct Buffer.buffer',
            name: 'buf',
            type: 'tuple'
          }
        ],
        internalType: 'struct ADCS.Request',
        name: 'req',
        type: 'tuple'
      }
    ],
    name: 'requestData',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'sOracles',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'maxGasLimit',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'gasAfterPaymentCalculation',
        type: 'uint256'
      }
    ],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'typeAndVersion',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  }
]
