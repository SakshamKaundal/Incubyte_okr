export type KeyResult = {
  id: number | null;
  description: string;
  progress: number;
  isCompleted: boolean;
};

export type OkrTypes = {
  id: number;
  title: string;
  keyResults: KeyResult[];
};
