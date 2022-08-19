# BurnServe

This library requires [Bun](https://bun.sh)

> This library is currently experimental and under development. Everything can CHANGE!

## Quickstart

```ts
import BurnServe from "burnserve";

const app = new BurnServe();

app.get("/", ctx => {
  ctx.sendHTML("lol");
});

app.get("/test", ctx => {
  ctx.sendHTML("You're on a test page");
});

app.get(/\/public\/.*/, ctx => {
  ctx.sendHTML("Public folder");
});

app.get(/\/ab(cd)?e/, ctx => {
  ctx.sendHTML("You're on a test page");
});

app.listen(
  {
    port: 3030,
  },
  opts => {
    console.log(`Server listening on port ${opts.port}`);
  }
);
```

## Documentation

## Any routing

The helper `anyRoute` make this possible

```ts
import BurnServe, { anyRoute } from "burnserve";

const app = new BurnServe();

app.get(anyRoute(["test", "public"]), ctx => {
  ctx.sendHTML("Hello, world!");
});

// If you don't exclude these path, they won't never show up
app.get("/test", ctx => {
  ctx.sendHTML("You're on a test page");
});

// Same here
app.get(/\/public\/.*/, ctx => {
  ctx.sendHTML("Public folder");
});

app.listen({
  port: 3030,
});
```
