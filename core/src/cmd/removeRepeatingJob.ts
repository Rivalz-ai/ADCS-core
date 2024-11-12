import { buildLogger } from '../logger'
import { removeRepeatingJob } from '../tools/removeRepeatingJob'

async function main() {
  // Get jobId from command line arguments
  const logger = buildLogger('removeRepeatingJob')
  const jobId = process.argv[2]

  if (!jobId) {
    logger.error('Please provide a job ID')
    process.exit(1)
  }

  try {
    const removed = await removeRepeatingJob(jobId, logger)
    logger.info({ jobId, removed }, 'Job removal completed')
    process.exit(0)
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to remove job')
    process.exit(1)
  }
}

main()
