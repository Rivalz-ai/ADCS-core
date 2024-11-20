
## Project Structure

### @api

The API service provides HTTP endpoints for the oracle system. Key features:

- Built with NestJS framework
- PostgreSQL database integration with Prisma ORM
- Reporter and Chain management system
- RESTful endpoints for data queries and system management


### @contracts

Smart contracts for the oracle system, implementing:

- ADCS Coordinator
- Consumer contracts for data requests
- Oracle registration and management
- Automated test suite

Key features:
- Built with Hardhat
- Solidity smart contracts
- Automated deployment scripts
- Comprehensive test coverage
- Multiple network support (testnet, mainnet)


### @core

Core service handling the oracle system's business logic:

- Listener service for blockchain events
- Worker service for processing oracle requests
- Queue management system using BullMQ
- Redis for caching and job processing

Key features:
- Event listening system
- Job queue processing
- Automated data fulfillment
- Error handling and logging
- Multi-chain support


## Environment Setup

Each component requires specific environment variables. Create `.env` files in respective directories:

- API: Database connection, service configuration
- Contracts: Network providers, private keys, deployment settings
- Core: Redis configuration, blockchain providers, service settings

## License

MIT License - See LICENSE file for details


