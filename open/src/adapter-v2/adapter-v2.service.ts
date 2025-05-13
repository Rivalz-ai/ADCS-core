import { Injectable } from '@nestjs/common'
import { adapterStructure } from '../structures/adapter'
import { graphStructure } from '../structures/graph'
@Injectable()
export class AdapterV2Service {
  async getAdapterStructure() {
    return adapterStructure
  }

  async getGraphStructure() {
    return graphStructure
  }
}
