import { createCoordinatorStream } from '../tools/quicknode'

async function main() {
  // Get chain from command line arguments
  const chain = process.argv[2]
  const coordinatorAddress = process.argv[3]
  const eventTopic = process.argv[4]
  const startBlock = process.argv[5]
  const webhookUrl = process.argv[6]

  if (!chain || !coordinatorAddress || !eventTopic || !startBlock || !webhookUrl) {
    console.error(
      'Please provide a chain, coordinatorAddress, eventTopic, startBlock, and webhookUrl'
    )
    process.exit(1)
  }

  try {
    const newStream = await createCoordinatorStream(
      chain,
      coordinatorAddress,
      eventTopic,
      Number(startBlock),
      webhookUrl
    )
    console.info({ newStream }, 'Coordinator stream created')
    process.exit(0)
  } catch (error) {
    console.error({ error }, 'Failed to create coordinator stream')
    process.exit(1)
  }
}

main()
