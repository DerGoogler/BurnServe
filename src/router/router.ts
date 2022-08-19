import BurnServe from "../burnserve";

namespace Router {
  export type Path = string | RegExp;
  export type Route = {
    method: string;
    path: Path;
    handler: BurnServe.Handler;
  };
}

class Router {
  private _routes: Router.Route[];

  public constructor() {
    this._routes = [];
    this.addRoute = this.addRoute.bind(this);
    this.findRoute = this.findRoute.bind(this);
  }

  public addRoute(method: string, path: Router.Path, handler: BurnServe.Handler) {
    this._routes.push({ method, path, handler });
  }

  public findRoute(method: string, pathname: string) {
    return this._routes.find((route) => {
      if (route.path instanceof RegExp) {
        return route.method === method && route.path.test(pathname);
      } else {
        return route.method === method && route.path === pathname;
      }
    });
  }
}

export default Router;
