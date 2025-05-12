export function getServerEndpoint() {
  // let serverEndpoint = "127.0.0.1:6001/"; /*'localhost:3005/'*/ /* 'iahmed:3005/' */ /*"172.19.91.147:4001/"*/
  // let serverEndpoint = "http://127.0.0.1:6001/"; /*'localhost:3005/'*/ /* 'iahmed:3005/' */ /*"172.19.91.147:4001/"*/
  let serverEndpoint = "http://" + window.location.host.slice(0, window.location.host.length - 4) + "6003/";
  if (process.env.NODE_ENV === "production") {
    serverEndpoint = window.location.protocol + "//" + window.location.host + "/";
  }

  return serverEndpoint;
}
