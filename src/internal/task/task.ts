export type Task = {
  type: string;
  payload: Record<string, any>;
  retries: number;
};

export type Metrices = {
  totalJobsInQueue: number;
  jobsDone: number;
  jobsFailed: number;
};
