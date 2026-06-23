import type { ProductListParams } from './types';

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (params: ProductListParams) => ['products', 'list', params] as const,
    byCategory: (id: string | number, page: number, limit: number) =>
      ['products', 'category', id, page, limit] as const,
    featured: (page: number, limit: number) =>
      ['products', 'featured', page, limit] as const,
    detail: (id: string | number) => ['products', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  cart: (userId: string | number) => ['cart', userId] as const,
  favorites: (userId: string | number) => ['favorites', userId] as const,
  orders: (userId: string | number) => ['orders', userId] as const,
  addresses: (userId: string | number) => ['addresses', userId] as const,
  deals: {
    active: ['deals', 'active'] as const,
  },
  banners: (storeId?: string | number | null) =>
    ['banners', storeId ?? 'all'] as const,
  store: (zip: string) => ['store', zip] as const,
};
