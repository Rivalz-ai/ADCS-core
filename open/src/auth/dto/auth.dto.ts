import { ApiProperty } from '@nestjs/swagger'
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator'

export class GetMsgDto {
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  @ApiProperty()
  address: string
}

export class GetMsgResp {
  message: string
  address: string
}

export class SigninDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hash: string
}

export class SigninResp {
  token: string
  address: string
}
