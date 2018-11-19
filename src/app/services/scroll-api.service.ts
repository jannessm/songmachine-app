import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ScrollApiService {

  private host = '';

  constructor(private httpClient: HttpClient) {}

  public setHost(host: string) {
    this.host = host;
  }

  public changeSong(songId: number) {
    if (this.host) {
      this.httpClient.get(`http://${this.host}/changeSong/${songId}`).toPromise().catch(err => console.log(err));
    }
  }

  public scroll(scrollTop: number) {
    if (this.host) {
      this.httpClient.get(`http://${this.host}/scroll/${scrollTop}`).toPromise().catch(err => console.log(err));
    }
  }
}
