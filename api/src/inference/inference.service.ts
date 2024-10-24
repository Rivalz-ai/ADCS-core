import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { INFERENCE_API_URL } from '../app.settings'
import { join } from 'path'
import { Agent } from 'http'

@Injectable()
export class InferenceService {
  axiosInstance: AxiosInstance
  constructor() {
    const agent = new Agent({ keepAlive: true })
    this.axiosInstance = axios.create({
      baseURL: INFERENCE_API_URL,
      timeout: 30000,
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

  // create sleep function
  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
