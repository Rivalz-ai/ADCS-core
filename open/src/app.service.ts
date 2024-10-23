import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  root() {
    return 'ADCS API'
  }
  health(): string {
    return 'OK'
  }
}
