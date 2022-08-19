import { file } from "bun";

export default class Context {
  /**
   * The raw Request object
   */
  public req: Request;
  /**
   * The Response object to be sent
   */
  public res: Response | null;

  /**
   * Anything extra supplied by the middleware
   */
  public extra: { [key: string]: any } = {};
  /**
   * URL parameters
   */
  public params: { [key: string]: string };

  /**
   * The HTTP method
   */
  public readonly method: string;
  /**
   * The headers supplied in the request
   */
  public readonly headers: Request["headers"];
  /**
   * The host as specified by the client
   */
  public readonly host: string;
  /**
   * The requested path (e.g. "/index.html")
   */
  public readonly path: string;
  /**
   * The URL object
   */
  public readonly url: URL;

  public constructor(req: Request) {
    this.req = req;
    this.res = null;

    const url = new URL(req.url);
    this.method = req.method;
    this.headers = req.headers;
    this.host = url.host;
    this.path = url.pathname;
    this.url = url;

    /**
     * Calling this (or arrayBuffer(), json(), text()) here
     * prevents freezing when trying to access any of them later
     */
    this.req.blob();
  }

  /**
   * Creates an empty response and adds it to Context
   *
   * @param options (optional) The Response object options
   * @returns The Context object with an empty response
   */
  public sendEmpty(options: ResponseInit = { headers: {} }): Context {
    this.res = new Response(null, options);
    return this;
  }

  /**
   * Creates a response with pretty printed JSON and adds it to Context
   *
   * @param json The JSON to be sent in the response
   * @param options (optional) The Response object options
   * @returns The Context object with pretty printed JSON
   */
  public sendPrettyJson(json: { [key: string]: any }, options: ResponseInit = { headers: {} }): Context {
    options.headers["Content-Type"] = "application/json";
    this.res = new Response(JSON.stringify(json, null, 4), options);
    return this;
  }

  /**
   * Creates a JSON response and adds it to Context
   *
   * @param json The JSON to be sent in the response
   * @param options (optional) The Response object options
   * @returns The Context object with plain JSON
   */
  public sendJson(json: { [key: string]: any }, options: ResponseInit = { headers: {} }): Context {
    options.headers["Content-Type"] = "application/json";
    this.res = new Response(JSON.stringify(json), options);
    return this;
  }

  /**
   * Creates an HTML response with the supplied content and adds it to Context
   *
   * @param html The html to respond with
   * @param options (optional) The Response object options
   * @returns The Context object with a html response
   */
  public sendHTML(html: string, options: ResponseInit = { headers: {} }): Context {
    options.headers["Content-Type"] = "text/html";
    this.res = new Response(html, options);
    return this;
  }

  /**
   * Sends an file and adds it to Context. The headers Content-Type decribes the content type of the file
   *
   * @param path The path to respond with
   * @param options (optional) The Response object options
   * @returns The Context object with a html response
   */
  public sendFile(path: string, options: ResponseInit = { headers: {} }): Context {
    this.res = new Response(
      file(path, {
        type: options.headers["Content-Type"],
      }),
      options
    );
    return this;
  }

  /**
   * Creates a simple response with the supplied text and adds it to Context
   *
   * @param text The text to respond with
   * @param options (optional) The Response object options
   * @returns The Context object with a text response
   */
  public sendText(text: string, options: ResponseInit = { headers: {} }): Context {
    this.res = new Response(text, options);
    return this;
  }

  /**
   * Adds a supplied Response to the Context object
   *
   * @param res The Response object to be added to Context
   * @returns The Context object with the supplied Response
   */
  public sendRaw(res: Response): Context {
    this.res = res;
    return this;
  }
}
