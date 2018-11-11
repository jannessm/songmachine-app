import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ScrollApiService {

  private host = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) {}

  public changeSong(songId: number) {
    this.httpClient.get(this.host + 'changeSong/' + songId );
  }

  public scroll(scrollTop: number) {
    console.log('scroll', scrollTop);
    this.httpClient.get(this.host + 'scroll/' + scrollTop).toPromise().catch(err => console.log(err));
  }
}
