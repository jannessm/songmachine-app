import { Injectable } from '@angular/core';
import { CreateOptions } from 'html-pdf';
import { Connector, ConnectorFactoryFunction, Methods, Modes } from '@nilsroesel/utils';
import {
  CmCreateFileRequest, CmDeleteFileRequest, CmFileLoadRequest,
  CmFileSystemIndexRequest,
  CmPdfRequest,
  CmResponse, CreateFileResponse, DeleteFileResponse, FileLoadResponse,
  FileSystemIndexResponse,
  PdfRequestResponse, UpdateFileResponse, LoadIndexFilesResponse
} from './model/client.model';
import { ConfigService } from '../config.service';
import { FILESYSTEM } from '../../models/filesystem';

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
    return new Promise<CmResponse<PdfRequestResponse>>((res, rej) =>
      res({status: 401, statusMessage: 'no path defined', payload: {created: false}}));
  }

  generateFileSystemIndex(): Promise<CmResponse<FileSystemIndexResponse>> {
    if (this.getPath()) {
      const path = this.getPath();
      return this.ConnectorFactory('index')
        .setMode(Modes.CORS)
        .dispatch<CmFileSystemIndexRequest, CmResponse<FileSystemIndexResponse>>(Methods.POST, { path });
    }
    return new Promise<CmResponse<FileSystemIndexResponse>>(res => res({status: 200, statusMessage: '', payload: []}));
  }

  generateLoadIndexFilesResponseRequest(): Promise<CmResponse<LoadIndexFilesResponse>> {
    if (this.getPath()) {
      const path = this.getPath();
      return this.ConnectorFactory('index')
        .setMode(Modes.CORS)
        .dispatch<undefined, CmResponse<LoadIndexFilesResponse>>(Methods.GET);
    }
    return new Promise<CmResponse<LoadIndexFilesResponse>>(res => res({status: 200, statusMessage: '', payload: []}));
  }

  generateFileCreateRequest<T>(path: string, payload: T): Promise<CmResponse<CreateFileResponse>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('file')
        .setMode(Modes.CORS)
        .dispatch<CmCreateFileRequest<T>, CmResponse<CreateFileResponse>>(Methods.POST, {path, payload});
    }
    return new Promise<CmResponse<CreateFileResponse>>((res, rej) =>
      rej({status: 401, statusMessage: 'no path defined', payload: undefined}));
  }

  generateDeleteFileRequest(path: string): Promise<CmResponse<DeleteFileResponse>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('file')
        .setMode(Modes.CORS)
        .dispatch<CmDeleteFileRequest, CmResponse<DeleteFileResponse>>(Methods.DELETE, { path });
    }
    return new Promise<CmResponse<DeleteFileResponse>>((res, rej) =>
      rej({status: 401, statusMessage: 'no path defined', payload: undefined}));
  }

  generateFileUpdateRequest<T>(path: string, payload: T): Promise<CmResponse<UpdateFileResponse>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('file/sync')
        .setMode(Modes.CORS)
        .dispatch<CmCreateFileRequest<T>, CmResponse<UpdateFileResponse>>(Methods.POST, { path, payload });
    }
    return new Promise<CmResponse<UpdateFileResponse>>((res, rej) =>
      rej({status: 401, statusMessage: 'no path defined', payload: undefined}));
  }

  generateFileLoadRequest<T>(path: string, asJson?: boolean): Promise<CmResponse<FileLoadResponse<T>>> {
    if (this.getPath()) {
      path = Path.join(this.getPath(), path);
      return this.ConnectorFactory('read')
        .setMode(Modes.CORS)
        .dispatch<CmFileLoadRequest, CmResponse<FileLoadResponse<T>>>(Methods.POST, { path, json: asJson });
    }
    return new Promise <CmResponse<FileLoadResponse<T>>>((res, rej) =>
      rej({status: 401, statusMessage: 'no path defined', payload: {data: undefined}}));
  }

  getPath() {
    const root = this.configService.get('defaultPath');
    return root ? Path.join(root, FILESYSTEM.DATA, '/') : '';
  }

}
