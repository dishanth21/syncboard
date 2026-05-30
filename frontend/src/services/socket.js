import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connectSocket(
  callback
) {

  const socket =
    new SockJS(
      "http://localhost:8081/ws"
    );

  stompClient =
    new Client({

      webSocketFactory: () =>
        socket,

      reconnectDelay:
        5000,

      debug: (msg) => {

        console.log(
          "STOMP:",
          msg
        );

      },

      onConnect: () => {

        console.log(
          "WebSocket Connected"
        );

        stompClient.subscribe(

          "/topic/task-moves",

          (message) => {

            console.log(
              "Received:",
              message.body
            );

            callback(

              JSON.parse(
                message.body
              )

            );

          }

        );

      },

      onStompError: (frame) => {

        console.log(
          "STOMP ERROR:",
          frame
        );

      }

    });

  stompClient.activate();

}

export function disconnectSocket() {

  if (
    stompClient
  ) {

    stompClient.deactivate();

    console.log(
      "WebSocket Disconnected"
    );

  }

}