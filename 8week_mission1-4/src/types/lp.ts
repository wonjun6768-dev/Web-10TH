import type { CursorBasedResponse } from './common';

export type Tag = {
  id: number;
  name: string;
};

export type Last = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  lasts: Last[];
};

export type LpListDto = CursorBasedResponse<{
  data: Lp[];
}>;