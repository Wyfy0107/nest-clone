import { Injectable } from '../decorators'
import { StudentService } from '../student/student.service'

@Injectable()
export class CourseService {
  constructor(private studentService: StudentService) {}

  getCourses() {
    return ['course 1', 'course 2', ...this.studentService.getStudents()]
  }
}
