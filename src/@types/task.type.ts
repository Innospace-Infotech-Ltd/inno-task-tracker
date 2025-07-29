export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface IFindTask {
  search?: string;
  status?: TaskStatus;
  dueFrom?: Date;
  dueTo?: Date;
  page?: string;
  limit?: string;
}
