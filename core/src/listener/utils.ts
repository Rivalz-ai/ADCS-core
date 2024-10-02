import { Logger } from 'pino'
import { RivalzError, RivalzErrorCode } from '../errors'
import { IListenerRawConfig, IListenerConfig, IListenerGroupConfig } from '../types'

const FILE_NAME = import.meta.url

export function groupListeners({
  listenersRawConfig
}: {
  listenersRawConfig: IListenerRawConfig[]
}): IListenerGroupConfig {
  const postprocessed = listenersRawConfig.reduce((groups, item) => {
    const group = groups[item.service] || []
    group.push(item)
    groups[item.service] = group
    return groups
  }, {})

  Object.keys(postprocessed).forEach((serviceName) => {
    return postprocessed[serviceName].map((listener) => {
      delete listener.service
      return listener
    })
  })

  return postprocessed
}

/**
 * Check whether every listener within a listener config contains
 * required properties: `address` and `eventName`.
 *
 * @param {IListenerConfig[]} listener configuration used for launching listeners
 * @param {pino.Logger?}
 * @return {boolean} true when the given listener configuration is valid, otherwise false
 */
export function validateListenerConfig(config: IListenerConfig[], logger?: Logger): boolean {
  const requiredProperties = ['address', 'eventName']

  for (const c of config) {
    const propertyExist = requiredProperties.map((p) => (c[p] ? true : false))
    const allPropertiesExist = propertyExist.every((i) => i)
    if (!allPropertiesExist) {
      logger?.error({ name: 'validateListenerConfig', file: FILE_NAME, ...c }, 'config')
      return false
    }
  }

  return true
}

export function postprocessListeners({
  listenersRawConfig,
  service,
  chain,
  logger
}: {
  listenersRawConfig: IListenerRawConfig[]
  service: string
  chain: string
  logger?: Logger
}): IListenerGroupConfig {
  if (listenersRawConfig.length == 0) {
    throw new RivalzError(
      RivalzErrorCode.NoListenerFoundGivenRequirements,
      `service: [${service}], chain: [${chain}]`
    )
  }
  const listenersConfig = groupListeners({ listenersRawConfig })
  const isValid = Object.keys(listenersConfig).map((k) =>
    validateListenerConfig(listenersConfig[k], logger)
  )

  if (!isValid.every((t) => t)) {
    throw new RivalzError(RivalzErrorCode.InvalidListenerConfig)
  }

  logger?.info(
    { name: 'postprocessListeners', file: FILE_NAME, ...listenersConfig },
    'listenersConfig'
  )

  return listenersConfig
}
