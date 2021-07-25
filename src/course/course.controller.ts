import 'reflect-metadata'
import { Request } from 'express'

import { Body, Controller, Get, Post, Req } from '../decorators'
import { IsEmail, IsNumber, IsPositive, IsString } from 'class-validator'

import { CourseService } from './course.service'

class CourseDto {
  @IsString()
  name!: string

  @IsNumber()
  @IsPositive()
  totalStudents!: number
}

@Controller('/course')
export class CourseController {
  constructor(private service: CourseService) {}

  @Get('/')
  getCourses() {
    return this.service.getCourses()
  }

  @Post('/')
  async createCourse(
    @Body({ validate: true }) body: CourseDto,
    @Req() req: Request
  ) {
    return 'ok'
  }
}
