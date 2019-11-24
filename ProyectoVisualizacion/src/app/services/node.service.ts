import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private httpClient: HttpClient) { }

  public getSongs(query: string) {
    return this.httpClient.get("http://localhost:9999/search", {
      params: {
        'q': query
      }
    }) as Observable<[{name:string, popularity:number, artists:[string], image:string, duration:string}]>;
  }

  public getGenre(query: string) {
    console.log("Getting " + query);
    return this.httpClient.get("http://localhost:9999/genre", {
      params: {
        'q': query
      }
    }) as Observable<{nombre: string, popularity: number, children: [{nombre: string, link: string, popularity: number, children: [{nombre: string, size: number}]}]}>;
  }
}
