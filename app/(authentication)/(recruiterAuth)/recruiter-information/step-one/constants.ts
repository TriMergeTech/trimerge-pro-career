export type { UsState } from '@/app/util/locationOptions';
export { US_STATES } from '@/app/util/locationOptions';

export const COMPANY_SIZE_OPTIONS = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1,000',
  '1,001-5,000',
  '5,001-10,000',
  '10,000+',
] as const;

export type CompanySizeOption = (typeof COMPANY_SIZE_OPTIONS)[number];
