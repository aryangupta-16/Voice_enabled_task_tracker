export class CreateTaskDto {
  title!: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  rawTranscript?: string;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export class TaskResponseDto {
  id!: string;
  title!: string;
  description: string | null = null;
  priority!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: Date | null = null;
  status!: 'TODO' | 'IN_PROGRESS' | 'DONE';
  rawTranscript: string | null = null;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(entity: any): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.priority = entity.priority;
    dto.dueDate = entity.dueDate;
    dto.status = entity.status;
    dto.rawTranscript = entity.rawTranscript;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
