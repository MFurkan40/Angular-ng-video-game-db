import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { environment as env } from 'src/environments/environment.prod';
import { APIResponse, Game } from '../../models';
import { catchError, finalize, map } from 'rxjs/operators';
import { LoaderService } from '../loader/loader.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    public loader: LoaderService,
    private route: ActivatedRoute
  ) {}

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    this.loader.setLoading(true);
    let params = new HttpParams().set('ordering', ordering);
    console.log(ordering);

    if (search) {
      params = params.set('ordering', ordering).set('search', search);
    }

    return this.http
      .get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
        params,
      })
      .pipe(
        finalize(() => {
          this.loader.setLoading(false);
        })
      );
  }

  getGameDetails(id: string): Observable<Game> {
    this.loader.setLoading(true);
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);

    const gameTrailersRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/movies`
    );

    const gameScreenshotsRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/screenshots`
    );

    return forkJoin({
      gameInfoRequest,
      gameTrailersRequest,
      gameScreenshotsRequest,
    }).pipe(
      map((res: any) => {
        return {
          ...res['gameInfoRequest'],
          screenshots: res['gameScreenshotsRequest']?.results,
          trailers: res['gameTrailersRequest']?.results,
        };
      }),
      finalize(() => {
        this.loader.setLoading(false);
      })
    );
  }
}
