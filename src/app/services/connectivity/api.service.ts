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
import { ConfigService } from '../config.service';
import { FILESYSTEM } from '../../models/filesystem';
import { DATABASES } from '../../models/databases';

const Path = require('path');

@Injectable()
export class ApiService {

  private ConnectorFactory: ConnectorFactoryFunction;

  constructor(private configService: ConfigService) {
    this.ConnectorFactory = Connector.to('api://');
  }

  generatePdfRequest(path: string, fileName: string, htmlData: string, opts?: CreateOptions): Promise<CmResponse<PdfRequestResponse>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('pdf')
        .setMode(Modes.CORS)
        .dispatch<CmPdfRequest, CmResponse<PdfRequestResponse>>(Methods.POST,  {
          filePath: path,
          fileName: fileName,
          payload: htmlData,
          metadata: opts || {}
      });
    }
    return null;
  }

  generateFileSystemIndex(): Promise<CmResponse<FileSystemIndexResponse>> {
    if (this.getPath()) {
      const path = this.getPath();
      return this.ConnectorFactory('index')
        .setMode(Modes.CORS)
        .dispatch<CmFileSystemIndexRequest, CmResponse<FileSystemIndexResponse>>(Methods.POST, { path });
    }
    return null;
  }

  generateFileCreateRequest<T>(path: string, payload: T): Promise<CmResponse<CreateFileResponse>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('file')
        .setMode(Modes.CORS)
        .dispatch<CmCreateFileRequest<T>, CmResponse<CreateFileResponse>>(Methods.POST, {path, payload});
    }
    return null;
  }

  generateDeleteFileRequest(path: string): Promise<CmResponse<DeleteFileResponse>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('file')
        .setMode(Modes.CORS)
        .dispatch<CmDeleteFileRequest, CmResponse<DeleteFileResponse>>(Methods.DELETE, { path });
    }
    return null;
  }

  generateFileUpdateRequest<T>(path: string, payload: T): Promise<CmResponse<UpdateFileResponse>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('file/sync')
        .setMode(Modes.CORS)
        .dispatch<CmCreateFileRequest<T>, CmResponse<UpdateFileResponse>>(Methods.POST, { path, payload });
    }
    return null;
  }

  generateFileLoadRequest<T>(path: string, asJson?: boolean): Promise<CmResponse<FileLoadResponse<T>>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('read')
        .setMode(Modes.CORS)
        .dispatch<CmFileLoadRequest, CmResponse<FileLoadResponse<T>>>(Methods.POST, { path, json: asJson });
    }
    return null;
  }

  getPath() {
    const root = this.configService.get('defaultPath');
    return root ? Path.join(root, FILESYSTEM.DATA, '/') : '';
  }

}
