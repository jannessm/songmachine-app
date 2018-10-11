import { Injectable } from '@angular/core';
import { CreateOptions } from 'html-pdf';
import { Connector, ConnectorFactoryFunction, Methods } from '@nilsroesel/utils';
import { CmPdfRequestPayload, CmPdfRequestResponse } from './model/client.model';


@Injectable()
export class ApiService {

  private ConnectorFactory: ConnectorFactoryFunction;

  constructor() {
    this.ConnectorFactory = Connector.to('api://');
  }

  generatePdfRequest(path: string, fileName: string, htmlData: string, opts?: CreateOptions): Promise<CmPdfRequestResponse> {
    return this.ConnectorFactory('pdf')
      .dispatch<CmPdfRequestPayload, CmPdfRequestResponse>(Methods.POST,  {
        filePath: path,
        fileName: fileName,
        payload: htmlData,
        metadata: opts || {}
    }).then();
  }
}
