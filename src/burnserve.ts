import { ServeOptions, Server, serve } from "bun";
import Context from "./context";
import Router from "./router/router";

namespace BurnServe {
  export type Handler = (ctx: Context) => void;
  export type Options = Omit<ServeOptions, "fetch" | "error">;
  export type Callback = (options: BurnServe.Options) => void;
}

class BurnServe {
  private _router: Router;
  private _onError: (err: Error) => Response = this.error;
  private _onNotFound: BurnServe.Handler;

  public constructor() {
    this._router = new Router();
    this._onNotFound = (ctx) => {
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

  public get(route: Router.Path, handler: BurnServe.Handler) {
    this._router.addRoute("get", route, handler);
  }

  public post(route: Router.Path, handler: BurnServe.Handler) {
    this._router.addRoute("post", route, handler);
  }

  public onError(handler: (err: Error) => Response): void {
    this._onError = handler;
  }

  public onNotFound(handler: BurnServe.Handler): void {
    this._onNotFound = handler;
  }

  public listen(options?: BurnServe.Options, callback?: BurnServe.Callback): Server {
    const server = serve({
      fetch: (req: Request) => {
        let ctx = new Context(req);

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

export default BurnServe;
