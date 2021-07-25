import { Module } from '../decorators'
import { StudentController } from './student.controller'

@Module({ controllers: [StudentController] })
export class StudentModule {}
