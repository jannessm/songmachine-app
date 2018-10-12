import { CreateOptions } from 'html-pdf';

export interface CmResponse<P> {
  status: number;
  statusMessage: string;
  payload: P;
}

export interface CmPdfRequest {
  filePath: string;
  fileName: string;
  payload: string;
  metadata: CreateOptions;
}

export interface PdfRequestResponse { created: boolean; }
