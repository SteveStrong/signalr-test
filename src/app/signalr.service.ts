import { Injectable } from '@angular/core';


import * as signalR from "@microsoft/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  pongSubject: Subject<any>;
  constructor() { }

  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
    const url = 'https://laweb700.azurewebsites.net/documentHub';
    //const url = ''
    //const url = 'https://iobtweb.azurewebsites.net/chatHub'

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
