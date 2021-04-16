import { Component } from '@angular/core';
import { SignalRService } from './signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'signalr-test';

  constructor(private srservice: SignalRService) {

  }

  ngOnInit() {
    this.srservice.startConnection();
  }
}
