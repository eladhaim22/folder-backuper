export interface BackupPlan {
  globExpression: string;
  baseSource: string;
  target: string;
  retention: number;
}
