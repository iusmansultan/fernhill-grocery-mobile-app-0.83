import { apiClient } from '../client';
import type { ApiResponse, Category } from '../types';

export async function fetchCategories() {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/category');
  return data;
}
