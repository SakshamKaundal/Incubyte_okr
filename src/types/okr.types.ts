export type KeyResult = {
  id: number;
  description: string;
  progress: number;
  target: number;
  metric: string;
};

export type Objective = {
  id: number;
  title: string;
  keyResults: KeyResult[];
};
