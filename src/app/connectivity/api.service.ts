import { Injectable } from '@angular/core';
import { CreateOptions } from 'html-pdf';
import { Connector, ConnectorFactoryFunction, Methods, Modes } from '@nilsroesel/utils';
import {
  CmCreateFileRequest, CmDeleteFileRequest, CmFileLoadRequest,
  CmFileSystemIndexRequest,
  CmPdfRequest,
  CmResponse, CreateFileResponse, DeleteFileResponse, FileLoadResponse,
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
      .setMode(Modes.CORS)
      .dispatch<CmPdfRequest, CmResponse<PdfRequestResponse>>(Methods.POST,  {
        filePath: path,
        fileName: fileName,
        payload: htmlData,
        metadata: opts || {}
    });
  }

  generateFileSystemIndex(path: string): Promise<CmResponse<FileSystemIndexResponse>> {
    return this.ConnectorFactory('index')
      .setMode(Modes.CORS)
      .dispatch<CmFileSystemIndexRequest, CmResponse<FileSystemIndexResponse>>(Methods.POST, { path });
  }

  generateFileCreateRequest<T>(path: string, payload: T): Promise<CmResponse<CreateFileResponse>> {
    return this.ConnectorFactory('file')
      .setMode(Modes.CORS)
      .dispatch<CmCreateFileRequest<T>, CmResponse<CreateFileResponse>>(Methods.POST, {path, payload})
  }

  generateDeleteFileRequest(path: string): Promise<CmResponse<DeleteFileResponse>> {
    return this.ConnectorFactory('file')
      .setMode(Modes.CORS)
      .dispatch<CmDeleteFileRequest, CmResponse<DeleteFileResponse>>(Methods.DELETE, { path });
  }

  generateFileUpdateRequest<T>(path: string, payload: T): Promise<CmResponse<UpdateFileResponse>> {
    return this.ConnectorFactory('file/sync')
      .setMode(Modes.CORS)
      .dispatch<CmCreateFileRequest<T>, CmResponse<UpdateFileResponse>>(Methods.POST, { path, payload });
  }

  generateFileLoadRequest<T>(path: string, asJson?: boolean): Promise<CmResponse<FileLoadResponse<T>>> {
    return this.ConnectorFactory('read')
      .setMode(Modes.CORS)
      .dispatch<CmFileLoadRequest, CmResponse<FileLoadResponse<T>>>(Methods.POST, { path, json: asJson });
  }

}
