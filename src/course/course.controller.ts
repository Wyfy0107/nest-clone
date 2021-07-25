import 'reflect-metadata'
import { Request } from 'express'

import { Body, Controller, Get, Post, Req } from '../decorators'
import { IsEmail, IsNumber, IsPositive, IsString } from 'class-validator'

class CourseDto {
  @IsString()
  name!: string

  @IsNumber()
  @IsPositive()
  totalStudents!: number
}

@Controller('/course')
export class CourseController {
  constructor() {}

  @Get('/')
  getCourse(@Req() req: Request) {
    return 'hello world'
  }

  @Post('/')
  async createCourse(
    @Body({ validate: true }) body: CourseDto,
    @Req() req: Request
  ) {
    return 'ok'
  }
}
