// 统一导出所有类型定义
export * from './common';
export * from './auth';
export * from './department';
export * from './security-guard';
export * from './patrol-point';
export * from './file';

// 兼容性类型别名（保持向后兼容）
export type { Department as Region } from './department';
export type { SecurityGuard as SafetyOfficer } from './security-guard';
export type { PatrolPoint as Point } from './patrol-point';
export type { SecurityGuardForm as SafetyOfficerForm } from './security-guard';
export type { PatrolPointForm as PointForm } from './patrol-point';
export type { SecurityGuardQuery as SafetyOfficerQuery } from './security-guard';
export type { PatrolPointQuery as PointQuery } from './patrol-point';
export type { DepartmentForm as RegionForm } from './department';
export type { DepartmentQuery as RegionQuery } from './department'; 