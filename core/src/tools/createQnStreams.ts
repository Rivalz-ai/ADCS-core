import { readFileSync } from 'fs'
import { join } from 'path'
import { createCoordinatorStream } from './quicknode'

async function createQnStreams() {
  const filePath = join(__dirname, 'data', 'streams.json')
  const fileData = readFileSync(filePath, 'utf8')
  const streams = JSON.parse(fileData)
  for (const stream of streams) {
    const { chain, coordinatorAddress, eventTopic, startBlock, webhookUrl } = stream
    const streamId = await createCoordinatorStream(
      chain,
      coordinatorAddress,
      eventTopic,
      startBlock,
      webhookUrl
    )
    console.log(streamId)
    return
  }
}
createQnStreams()
