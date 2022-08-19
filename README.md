# BurnServe

This library requires [Bun](https://bun.sh)

> This library is currently experimental and under development. Everything can CHANGE!

## Quickstart

```ts
import BurnServe from "burnserve";

const app = new BurnServe();

app.get("/", (ctx) => {
  ctx.sendHTML("lol");
});

app.get("/test", (ctx) => {
  ctx.sendHTML("You're on a test page");
});

app.get(/\/public\/.*/, (ctx) => {
  ctx.sendHTML("Public folder");
});

app.get(/\/ab(cd)?e/, (ctx) => {
  ctx.sendHTML("You're on a test page");
});

app.listen(
  {
    port: 3030,
  },
  (opts) => {
    console.log(`Server listening on port ${opts.port}`);
  }
);
```
