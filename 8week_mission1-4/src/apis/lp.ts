import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";

// 1. 개별 아이템 타입
export interface LpItem {
  id: number;
  thumbnail: string;
  title: string;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt?: string;
  author?: { id: number; name: string; avatar: string | null };
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
}

// 2. API 전체 응답 타입
export interface LpResponse {
  status: boolean;
  message: string;
  data: {
    data: LpItem[];
    nextCursor?: number;
    hasNext: boolean;
  };
}

export interface CreateLpBody {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

// 댓글 타입
export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: { id: number; name: string; avatar: string | null };
}

export interface CommentResponse {
  status: boolean;
  message: string;
  data: {
    data: Comment[];
    nextCursor?: number;
    hasNext: boolean;
  };
}

// LP 목록 조회 (인피니트 스크롤 용)
export const getInfiniteLpList = async ({
  cursor,
  limit,
  search,
  order,
}: PaginationDto) => {
  const { data } = await axiosInstance.get<LpResponse>("/v1/lps", {
    params: {
      cursor: cursor ?? 0,
      limit: limit ?? 50,
      search: search || undefined,
      order,
    },
  });
  return data.data; // { data: LpItem[], nextCursor?: number, hasNext: boolean }
};

// LP 목록 조회
export const getLpList = async ({
  cursor,
  limit,
  search,
  order,
}: PaginationDto): Promise<LpItem[]> => {
  const { data } = await axiosInstance.get<LpResponse>("/v1/lps", {
    params: {
      cursor: cursor ?? 0,
      limit: limit ?? 50,
      search: search || undefined,
      order,
    },
  });
  return data.data.data;
};

// LP 상세 조회
export const getLpDetail = async (lpId: number): Promise<LpItem> => {
  const { data } = await axiosInstance.get<{ data: LpItem }>(`/v1/lps/${lpId}`);
  return data.data;
};

// LP 생성
export const postLp = async (body: CreateLpBody): Promise<LpItem> => {
  const { data } = await axiosInstance.post<{ data: LpItem }>("/v1/lps", body);
  return data.data;
};

// LP 수정
export const patchLp = async (
  lpId: number,
  body: Partial<CreateLpBody>
): Promise<LpItem> => {
  const { data } = await axiosInstance.patch<{ data: LpItem }>(`/v1/lps/${lpId}`, body);
  return data.data;
};

// LP 삭제
export const deleteLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}`);
};

// 좋아요
export const likeLp = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

// 좋아요 취소
export const unlikeLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

// 댓글 목록 조회
export const getComments = async (lpId: number): Promise<Comment[]> => {
  const { data } = await axiosInstance.get<CommentResponse>(
    `/v1/lps/${lpId}/comments`,
    { params: { cursor: 0, limit: 100, order: "asc" } }
  );
  return data.data.data;
};

// 댓글 작성
export const postComment = async (lpId: number, content: string): Promise<Comment> => {
  const { data } = await axiosInstance.post<{ data: Comment }>(
    `/v1/lps/${lpId}/comments`,
    { content }
  );
  return data.data;
};

// 댓글 수정
export const patchComment = async (
  lpId: number,
  commentId: number,
  content: string
): Promise<Comment> => {
  const { data } = await axiosInstance.patch<{ data: Comment }>(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data.data;
};

// 댓글 삭제
export const deleteComment = async (
  lpId: number,
  commentId: number
): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};