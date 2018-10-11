import { CreateOptions } from 'html-pdf';

export interface CmPdfRequestPayload {
  filePath: string;
  fileName: string;
  payload: string;
  metadata: CreateOptions;
}

export interface CmPdfRequestResponse { created: boolean; }
