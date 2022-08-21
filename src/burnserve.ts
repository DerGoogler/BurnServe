import { ServeOptions, Server, serve } from "bun";
import Context from "./context";
import { anyRoute } from "./helper/helper";
import Router from "./router/router";

namespace BurnServe {
  // export type CTX = d
  export type Handler<C extends Context = Context> = (ctx: C) => void;
  export type Options<C extends Context = Context, R extends Router = Router> = {
    /**
     * Using an custom router handler
     */
    router?: new () => R | Router;
    /**
     * Using an custom context handler
     */
    context?: new (req: Request) => C | Context;
  };
  export type ListenOptions = Omit<ServeOptions, "fetch" | "error">;
  export type Callback = (options: BurnServe.ListenOptions) => void;
}

class BurnServe<C extends Context = Context, R extends Router = Router> {
  public router: BurnServe.Options<C, R>["router"];
  public context: BurnServe.Options<C, R>["context"];
  private _onError: (err: Error) => Response = this.error;
  private _onNotFound: BurnServe.Handler;
  private _router: R | Router;

  public constructor(options?: BurnServe.Options) {
    this.router = options.router || Router;
    this.context = options.context || Context;
    this._router = new this.router();
    this._onNotFound = ctx => {
      ctx.sendHTML("404 Not Found");
    };
    this._onError = (err: Error) => {
      return new Response(err.toString());
    };
  }

  private error(err: Error): Response {
    return new Response("uh oh! :(" + String(err.toString()), {
      status: 500,
    });
  }

  public get(route: Router.Path, handler: BurnServe.Handler<C>) {
    this._router.addRoute("get", route, handler);
  }

  /**
   * The `getAR` method is like any route, you define an array for paths that should excluded fron any routing.
   * @param route {Array<string>}
   * @param handler
   */
  public getAR(exRoute: string[], handler: BurnServe.Handler<C>) {
    this._router.addRoute("get", anyRoute(exRoute), handler);
  }

  public post(route: Router.Path, handler: BurnServe.Handler<C>) {
    this._router.addRoute("post", route, handler);
  }

  public onError(handler: (err: Error) => Response): void {
    this._onError = handler;
  }

  public onNotFound(handler: BurnServe.Handler<C>): void {
    this._onNotFound = handler;
  }

  public listen(options?: BurnServe.ListenOptions, callback?: BurnServe.Callback): Server {
    const server = serve({
      fetch: (req: Request) => {
        let ctx = new this.context(req);

        const method = req.method.toLowerCase();
        const { pathname } = new URL(req.url);
        const found = this._router.findRoute(method, pathname);
        if (found) {
          found.handler(ctx);
        } else {
          this._onNotFound(ctx);
        }

        return ctx.res;
      },
      error: this._onError,

      hostname: options.hostname,
      port: options.port,
      baseURI: options.baseURI,
      development: options.development,
      maxRequestBodySize: options.maxRequestBodySize,
      // SSL is enabled if these two are set
      // certFile: "./cert.pem",
      // keyFile: "./key.pem",
    });

    if (server && callback) {
      callback(options);
    }

    return server;
  }
}

export { BurnServe, Router, Context };
