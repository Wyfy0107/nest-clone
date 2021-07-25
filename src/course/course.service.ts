import { StudentService } from '../student/student.service'

export class CourseService {
  constructor(private studentService: StudentService) {}

  getCourses() {
    return ['course 1', 'course 2']
  }
}
