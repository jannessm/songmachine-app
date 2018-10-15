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

export interface CmFileSystemIndexRequest { path: string; }

export type FileSystemIndexResponse = Array<string>;

export interface CmCreateFileRequest<T> {
  path: string;
  payload: T
}

export type CreateFileResponse = undefined;

export interface UpdateFileResponseOnChanges { currentVersion: any; }

export type UpdateFileResponse = UpdateFileResponseOnChanges | CreateFileResponse;

export interface CmDeleteFileRequest { path: string; }

export type DeleteFileResponse = undefined;
