import { Injectable } from '@angular/core';
import { CreateOptions } from 'html-pdf';
import { Connector, ConnectorFactoryFunction, Methods } from '@nilsroesel/utils';
import {
  CmCreateFileRequest, CmDeleteFileRequest,
  CmFileSystemIndexRequest,
  CmPdfRequest,
  CmResponse, CreateFileResponse, DeleteFileResponse,
  FileSystemIndexResponse,
  PdfRequestResponse, UpdateFileResponse
} from './model/client.model';


@Injectable()
export class ApiService {

  private ConnectorFactory: ConnectorFactoryFunction;

  constructor() {
    this.ConnectorFactory = Connector.to('api://');
  }

  generatePdfRequest(path: string, fileName: string, htmlData: string, opts?: CreateOptions): Promise<CmResponse<PdfRequestResponse>> {
    return this.ConnectorFactory('pdf')
      .dispatch<CmPdfRequest, CmResponse<PdfRequestResponse>>(Methods.POST,  {
        filePath: path,
        fileName: fileName,
        payload: htmlData,
        metadata: opts || {}
    });
  }

  generateFileSystemIndex(path: string): Promise<CmResponse<FileSystemIndexResponse>> {
    return this.ConnectorFactory('index')
      .dispatch<CmFileSystemIndexRequest, CmResponse<FileSystemIndexResponse>>(Methods.POST, { path });
  }

  generateFileCreateRequest<T>(path: string, payload: T): Promise<CmResponse<CreateFileResponse>> {
    return this.ConnectorFactory('file')
      .dispatch<CmCreateFileRequest<T>, CmResponse<CreateFileResponse>>(Methods.POST, {path, payload})
  }

  generateDeleteFileRequest(path: string): Promise<CmResponse<DeleteFileResponse>> {
    return this.ConnectorFactory('file')
      .dispatch<CmDeleteFileRequest, CmResponse<DeleteFileResponse>>(Methods.DELETE, { path });
  }

  generateFileUpdateRequest<T>(path: string, payload: T): Promise<CmResponse<UpdateFileResponse>> {
    return this.ConnectorFactory('file/sync')
      .dispatch<CmCreateFileRequest<T>, CmResponse<UpdateFileResponse>>(Methods.POST, { path, payload });
  }

}
