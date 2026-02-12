export type KeyResult = {
  id: number | null;
  description: string;
  progress: number;
  isCompleted: boolean;
  target?: number;
  metric?: string;
};


export type OkrTypes = {
  id: number;
  title: string;
  keyResults: KeyResult[];
};
