/**
 * Sorts category trees by API `sort_order` (siblings only), recursively.
 * Matches admin dashboard / backend ordering.
 */
export function sortCategoryTree<T extends { sort_order?: number; sub_categories?: T[] }>(
  nodes: T[] | undefined
): T[] {
  if (!nodes?.length) return [];
  return [...nodes]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((node) => ({
      ...node,
      sub_categories: node.sub_categories
        ? sortCategoryTree(node.sub_categories)
        : undefined,
    }));
}
