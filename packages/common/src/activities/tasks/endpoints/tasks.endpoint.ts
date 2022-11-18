import { UpdateTaskDto, UpdateTaskResponseDto, UpdateTaskStateResultDto, CreateTaskDto } from '../dtos';
import { Endpoint } from '@/endpoints';
import { CalendarDate } from '@/calendar';

export interface ITasksEndpointService {
  create(dto: CreateTaskDto): Promise<UpdateTaskResponseDto>;
  update(id: string, update: UpdateTaskDto): Promise<UpdateTaskResponseDto>;
  setDone(id: string, date: CalendarDate): Promise<UpdateTaskStateResultDto>;
  setUndone(id: string, date: CalendarDate): Promise<UpdateTaskStateResultDto>;
  //startTimer(dto: TimerUpdate): Promise<NumberDataPointModel>;
  //stopTimer(dto: TimerUpdate): Promise<NumberDataPointModel>;
}

export type TasksEndpoint = Endpoint<ITasksEndpointService>;
