import { apiClient, authHeaders } from '../client';
import type { ApiResponse, PaginatedProducts, Product, ProductListParams } from '../types';

export async function fetchProducts(params: ProductListParams = {}) {
  const { page = 1, limit = 10, search = '', categoryId = null } = params;

  const query = new URLSearchParams();
  query.append('page', String(page));
  query.append('limit', String(limit));
  if (search.trim()) {
    query.append('search', search.trim());
  }
  if (categoryId != null && categoryId !== '' && categoryId !== 'all') {
    query.append('categoryId', String(categoryId));
  }

  const { data } = await apiClient.get<ApiResponse<Product[]> & PaginatedProducts>(
    `/product?${query.toString()}`
  );
  return data;
}

export async function fetchProductsByCategory(
  id: string | number,
  page = 1,
  limit = 10
) {
  const { data } = await apiClient.get<ApiResponse<Product[]>>(
    `/product/getAllByCategory/${id}?page=${page}&limit=${limit}`
  );
  return data;
}

export async function fetchProductDetails(token: string, id: string | number) {
  const { data } = await apiClient.get<ApiResponse<Product>>(`/product/details/${id}`, {
    headers: authHeaders(token),
  });
  return data;
}

export async function fetchFeaturedProducts(page = 1, limit = 10) {
  const { data } = await apiClient.get<ApiResponse<Product[]>>(
    `/product/featured?page=${page}&limit=${limit}`
  );
  return data;
}
