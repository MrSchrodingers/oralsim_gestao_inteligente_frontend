export interface IPagedResponse<T> {
  results: T[];
  total_items: number;
  page: number;
  page_size: number;
  total_pages: number;
  items_on_page: number;
  summary?: {
    with_receivable: number,
    with_collection: number,
    with_notifications: number,
    whatsapp: number,
    sms: number,
    email: number,
    high: number
    medium: number
    normal: number
    total_overdue: number
    avg_attempts: number
  }
}