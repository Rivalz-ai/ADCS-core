import { Injectable } from '@nestjs/common'
import { adapterStructure } from '../structures/adapter'
import { graphStructure } from '../structures/graph'
import { CreateAdapterDto } from './dto/create.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { generateUniqueId } from 'src/app.utils'

@Injectable()
export class AdapterV2Service {
  constructor(private readonly prismaService: PrismaService) {}
  async getAdapterStructure() {
    return adapterStructure
  }

  async getGraphStructure() {
    return graphStructure
  }

  async createAdapter(adapterDto: CreateAdapterDto) {
    const nodeDefinition = Object.keys(adapterDto.nodes)
    const graphFlow: Prisma.NodeCreateManyInput[] = await Promise.all(
      adapterDto.graph_flow.map(async (node, i) => {
        console.log({ node })
        const nodeKey = nodeDefinition.find((key) => key === node.id)
        const nodeId = adapterDto.nodes[nodeKey]
        console.log({ nodeKey, nodeId })
        const sourceType = nodeId.startsWith('P') ? 'provider' : 'adaptor'
        const nodeSource =
          sourceType === 'provider'
            ? await this.prismaService.providerV2.findUnique({ where: { code: nodeId } })
            : await this.prismaService.adaptorV2.findUnique({ where: { code: nodeId } })
        const nodeSourceId = nodeSource.id
        console.log({ nodeSourceId })
        let methodId = undefined
        if (sourceType === 'provider') {
          const method = await this.prismaService.providerMethod.findFirst({
            where: { providerId: nodeSourceId, methodName: node.input_method },
            include: {
              outputEntity: true
            }
          })
          console.log({ method })
          methodId = method.id
        }
        return {
          nodeId: nodeSourceId,
          nodeType: sourceType,
          methodName: node.input_method,
          providerMethodId: methodId,
          inputValues: JSON.stringify(node.input),
          index: i,
          outputName: node.output
        }
      })
    )

    const code = generateUniqueId()
    const adapterData: Prisma.AdaptorV2CreateInput = {
      name: adapterDto.name,
      description: adapterDto.description,
      iconUrl: adapterDto.icon,
      coreLLM: adapterDto.core_llm,
      staticContext: adapterDto.static_context,
      nodesDefinition: JSON.stringify(adapterDto.nodes),
      code: `A${code}`,
      inputEntity: {
        create: {
          name: `${adapterDto.name}-input`,
          object: adapterDto.input_schema
        }
      },
      outputEntity: {
        create: {
          name: `${adapterDto.name}-output`,
          object: adapterDto.output_schema
        }
      }
    }

    const adapter = await this.prismaService.adaptorV2.create({
      data: adapterData
    })

    await this.prismaService.node.createMany({
      data: graphFlow
    })

    return adapter
  }
}
