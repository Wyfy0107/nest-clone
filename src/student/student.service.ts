import { Injectable, Post } from './../decorators/index'
import { StudentDto } from './student.controller'

@Injectable()
export class StudentService {
  constructor() {}

  getStudents() {
    return ['student 1', 'student 2']
  }

  createStudent(body: StudentDto) {
    return body
  }
}
