import { UpdateTaskDto, UpdateTaskResponseDto, UpdateTaskStateResultDto, CreateTaskDto } from '../dtos';
import { Endpoint } from '@/endpoints';
import { CalendarDate, TimerModel } from '@/calendar';

export interface ITasksEndpointService {
  create(dto: CreateTaskDto): Promise<UpdateTaskResponseDto>;
  update(id: string, update: UpdateTaskDto): Promise<UpdateTaskResponseDto>;
  setDone(id: string, date: CalendarDate): Promise<UpdateTaskStateResultDto>;
  setUndone(id: string, date: CalendarDate): Promise<UpdateTaskStateResultDto>;
  startTimer(id: string): Promise<TimerModel>;
  stopTimer(id: string): Promise<TimerModel>;
  updateTimer(id: string, value: number): Promise<TimerModel>;
}

export type TasksEndpoint = Endpoint<ITasksEndpointService>;
