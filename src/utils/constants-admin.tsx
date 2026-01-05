import type { TLanguages, TSort } from '@/types/types';

export const SORT_SELECT_1 = [
  { label: 'Name Ascending', value: 'NAME_ASC' as TSort },
  { label: 'Name Descending', value: 'NAME_DESC' as TSort },
  { label: 'Newest First', value: 'NEWEST' as TSort },
  { label: 'Oldest First', value: 'OLDEST' as TSort },
];

export const SORT_SELECT_2 = [
  { label: 'Title Ascending', value: 'NAME_ASC' as TSort },
  { label: 'Title Descending', value: 'NAME_DESC' as TSort },
  { label: 'Newest First', value: 'NEWEST' as TSort },
  { label: 'Oldest First', value: 'OLDEST' as TSort },
];

export const LANGUAGES: TLanguages[] = ['cpp', 'java', 'javascript', 'python'];
