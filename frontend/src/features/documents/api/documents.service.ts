import { api } from "@/lib/api";
import type { DocumentRecord } from "@/features/documents/types";

export const documentsService = {
  async upload(file: File, folder = "residencies"): Promise<DocumentRecord> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const { data } = await api.post<DocumentRecord>("/documents/", formData);
    return data;
  },
};
