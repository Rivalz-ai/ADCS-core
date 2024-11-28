import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { INFERENCE_API_URL } from '../app.settings'
import { format, join } from 'path'
import { Agent } from 'http'
import { PrismaService } from '../prisma.service'

@Injectable()
export class InferenceService {
  axiosInstance: AxiosInstance
  constructor(private prismaService: PrismaService) {
    const agent = new Agent({ keepAlive: true })
    this.axiosInstance = axios.create({
      baseURL: INFERENCE_API_URL,
      httpAgent: agent
    })
  }

  async meme() {
    const url = join('meme', 'trend')
    try {
      const startTime = Date.now()
      const rs = await this.axiosInstance.get(url)
      const endTime = Date.now()
      console.log(`Response received after ${endTime - startTime} ms`)
      return rs.data
    } catch (error) {
      console.log(error)
    }
  }

  async analyze(model: string, content: string, dataTypeId: number) {
    const outputType = await this.prismaService.outputType.findFirst({
      where: {
        id: dataTypeId
      }
    })
    if (!outputType) {
      throw new Error('Output type not found')
    }
    const format = outputType.format
    const url = join(model, 'analyze')
    try {
      const rs = await this.axiosInstance.post(url, { content, format })
      return rs.data
    } catch (error) {
      console.log(error)
    }
  }
  // create sleep function
  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
