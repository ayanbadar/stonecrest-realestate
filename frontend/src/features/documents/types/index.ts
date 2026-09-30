export type DocumentRecord = {
  id: number;
  original_name: string;
  content_type: string;
  size: number;
  folder: string;
  url: string;
  uploaded_by: number | null;
  uploaded_by_username: string;
  created_at: string;
  updated_at: string;
};
