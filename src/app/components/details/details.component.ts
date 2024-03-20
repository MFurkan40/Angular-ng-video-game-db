import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models';
import { HttpService } from 'src/app/services/service/http.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  gameRating = 0;
  gameId: string;
  game: Game;
  routeSub: Subscription;
  gameSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.getGamesDetails(this.gameId);
    });
  }

  isLoading(): boolean {
    return this.loaderService.getLoading();
  }

  getGamesDetails(id: string): void {
    this.gameSub = this.httpService
      .getGameDetails(id)
      .subscribe((gameRes: Game) => {
        console.log(gameRes);
        this.game = gameRes;
        console.log(this.game);

        setTimeout(() => {
          this.gameRating = this.game.metacritic;
        }, 1000);
      });
  }

  getColor(value: number): string {
    if (value > 75) {
      return '#5ee432';
    } else if (value > 50) {
      return '#fffa50';
    } else if (value > 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }
  }
}
