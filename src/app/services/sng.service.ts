import { Injectable } from '@angular/core';

@Injectable()
export class SngService {
  constructor() {}

  public getSngFile(song: Song): File {

  }

  private getSngHeader(song: Song): string {
    return '';
  }

  private getSngForBlock(song: Song): string {
    return '';
  }
}
