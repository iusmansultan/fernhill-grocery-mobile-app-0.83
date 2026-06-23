export interface ApiResponse<T> {
  status: boolean;
  msg?: string;
  message?: string;
  data: T;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedProducts {
  data: Product[];
  pagination?: PaginationInfo;
}

export interface Product {
  id: number;
  name: string;
  price: number | string;
  description?: string;
  thumb?: string;
  tax_status?: string;
  tax_class?: string;
  category_id?: number;
  quantity?: number;
  [key: string]: unknown;
}

export interface Category {
  id: number;
  name: string;
  thumb?: string;
  sort_order?: number;
  sub_categories?: Category[];
  parent_id?: number;
}

export interface CartItem {
  product_id?: number;
  deal_id?: number;
  quantity?: number;
  [key: string]: unknown;
}

export interface Address {
  id: number;
  first_name: string;
  last_name?: string;
  street1: string;
  street2?: string;
  postal_code: string;
  town: string;
  phone: string;
  default_address?: boolean;
  user_id?: number;
}

export interface Order {
  id: number;
  status: string;
  total: number | string;
  delivery_type: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CheckoutSummary {
  total_price: number;
  taxable_subtotal: number;
  delivery_qualifying_subtotal: number;
  sales_tax: number;
  delivery_charges: number;
  govt_bag_charge: number;
  total_price_inclusive_tax: number;
  products: Product[];
  deals: unknown[];
  off_amount: number;
  order_count: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  phone?: string;
  image?: string;
  user_address?: Address[];
  [key: string]: unknown;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string | number | null;
}

export interface AuthToken {
  token: string;
  user: User;
}

export interface AddAddressBody {
  userId: string | number;
  firstName: string;
  lastName: string;
  street1: string;
  street2: string;
  town: string;
  postalCode: string;
  phone: string;
  isDefaultAddress: boolean;
}
