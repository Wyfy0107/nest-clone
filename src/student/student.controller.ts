import { IsString } from 'class-validator'

import { Body, Controller, Get, Post } from '../decorators'
import { StudentService } from './student.service'

export class StudentDto {
  @IsString()
  firstName!: string

  @IsString()
  lastName!: string
}

@Controller('/student')
export class StudentController {
  constructor(private service: StudentService) {}

  @Post('/')
  createStudent(@Body({ validate: true }) body: StudentDto) {
    return this.service.createStudent(body)
  }

  @Get('/all')
  getStudents() {
    return this.service.getStudents()
  }
}
