import { CourseController } from './course.controller'
import { Module } from '../decorators'

@Module({ controllers: [CourseController] })
export class CourseModule {}
