export interface IPagedResponse<T> {
  results: T[];
  total_items: number;
  page: number;
  page_size: number;
  total_pages: number;
  items_on_page: number;
}