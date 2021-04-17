import { Injectable } from '@angular/core';


import * as signalR from "@microsoft/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';

// https://www.youtube.com/watch?v=m4N41JYrSjw
// https://www.codemag.com/article/1807061/Build-Real-time-Applications-with-ASP.NET-Core-SignalR

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  pongSubject: Subject<any>;
  constructor() { }

  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
    let url = '';
    url = 'https://localhost:5001/documentHub';
    url = 'https://localhost:44360/documentHub';
    url = 'https://localhost:8080/documentHub';
    url = 'https://localhost:8080/chatHub';
    url = 'https://iobtweb.azurewebsites.net/chatHub'

    // it works - I think the problem was the service plan,  free does not work.
    url = 'https://laweb700.azurewebsites.net/documentHub';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        withCredentials: false,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Debug)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.hubConnection.on('Pong', (data) => {
          alert(data)
        });
        this.doPing();
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }



  public Pong$(): Subject<any> {
    if (!this.pongSubject) {
      this.pongSubject = new Subject<any>();
      this.hubConnection.on('Pong', (data) => {
        this.pongSubject.next(data);
      });
    }

    return this.pongSubject;
  }

  doPing() {
    const msg = `Everybody play ping pong `;
    this.hubConnection.invoke('Ping', msg);
  }

  doPingPong() {
    const msg = `Others play ping pong `;
    this.hubConnection.invoke('PingPong', msg);
  }

}
