import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private httpClient: HttpClient) { }

  public getSongs(query: string): Observable<[{name:string, popularity:number, artists:[string], image:string, duration:string}]> {
    return this.httpClient.get("http://localhost:9999/search", {
      params: {
        'q': query
      }
    }) as Observable<[{name:string, popularity:number, artists:[string], image:string, duration:string}]>;
  }
}
