import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  constructor(private loaderService: LoaderService) {}

  isLoading(): boolean {
    return this.loaderService.getLoading();
  }
}
