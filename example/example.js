import { Gimme } from 'https://boughpohpue.github.io/just.js/compiled/just.js-1.0.1.js';
import RequestHandler from '../content/request_handler.js';
import ObservableRequest from './observable_request.js';


(async () => {

  const WINDOW_ID = Gimme.randomUuid;

  RequestHandler.init(handleRequests);

  function handleRequests(url, json) {
    try {
      const request = ObservableRequest.match(url);

      if (!request) {
        const e = new Error(`Undefined request (${url})`);
        e.windowId = WINDOW_ID;
        throw e;
      }

      switch (request) {
        case ObservableRequest.PostRequest1:
          handlePostRequest1(url, json);
          break;
        case ObservableRequest.PostRequest2:
          handlePostRequest2(url, json);
          break;
        case ObservableRequest.GetRequest1:
          handleGetRequest1(url, json);
          break;
        case ObservableRequest.GetRequest2:
          handleGetRequest2(url, json);
          break;
        case ObservableRequest.DeleteRequest:
          handleDeleteRequest(url, json);
          break;
        default:
          throw new Error(`Unhandled request (${request.name})`);
      }
    } catch (e) {
      console.error(e, "HandleRequest");
    }
  }

  function handlePostRequest1(url, json) {
    console.log(`${nameof(handlePostRequest1)}`);
    // Do something on ObservableRequest.PostRequest1
  }
  function handlePostRequest2(url, json) {
    console.log(`${nameof(handlePostRequest2)}`);
    // Do something on ObservableRequest.PostRequest2
  }
  function handleGetRequest1(url, json) {
    console.log(`${nameof(handleGetRequest1)}`);
    // Do something on ObservableRequest.GetRequest1
  }
  function handleGetRequest2(url, json) {
    console.log(`${nameof(handleGetRequest2)}`);
    // Do something on ObservableRequest.GetRequest2
  }
  function handleDeleteRequest(url, json) {
    console.log(`${nameof(handleDeleteRequest)}`);
    // Do something on ObservableRequest.DeleteRequest
  }
})();
