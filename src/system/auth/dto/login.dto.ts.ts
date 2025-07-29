import {
  IsString,
  IsOptional,
  IsInt,
  IsNotEmpty,
  Length,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    // $value:当前用户传入的值
    // $property:当前属性名
    // $target:当前类
    // $constraint1:最小长度
    message: `用户名长度必须在$constraint1到$constraint2之间，当前传递的值是:$value`,
  })
  readonly password: string;
}
