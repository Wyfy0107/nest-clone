import { StudentModule } from './student/student.module'
import { CourseModule } from './course/course.module'
import { Module } from './decorators'

@Module({ imports: [CourseModule, StudentModule] })
export class AppModule {}
