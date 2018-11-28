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
  payload: T;
}

export type CreateFileResponse = undefined;

export interface UpdateFileResponseOnChanges { currentVersion: any; indexedVersion: any; }

export type UpdateFileResponse = UpdateFileResponseOnChanges | CreateFileResponse;

export interface CmDeleteFileRequest { path: string; }

export type DeleteFileResponse = undefined;

export interface CmFileLoadRequest {
  path: string;
  json: boolean;
}

export interface FileLoadResponse<T> { data: T; }

export type LoadIndexFilesResponse = Array<{path: string, content: any}>;

export interface RunHttpServerRequest { htmls: string[]; title: string; hostWidth: number; hostHeight: number; }
export type StopHttpServerRequest = undefined;
export interface RunHttpServerResponse { url: string; }
export type HttpServerResponse = undefined;
export interface CmBlobRequest {
  blob: any;
  fileName: string;
  encoding: string;
}

export type BlobResponse = undefined | {};

export interface CmOpenUrlRequest { url: string; }
export type CmOpenUrlResponse = undefined;
