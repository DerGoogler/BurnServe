import { anyRoute, BurnServe } from "./../src";

const app = new BurnServe();

app.get(anyRoute(["test", "public"]), ctx => {
  ctx.sendHTML("lol");
});

app.get("/test", ctx => {
  ctx.sendFile("./../../package.json", {
    headers: { "Content-type": "application/json" },
  });
});

app.get(/\/public\/.*/, ctx => {
  ctx.sendHTML("Public folder");
});

app.listen(
  {
    port: 3030,
  },
  opts => {
    console.log(`Server listening on port ${opts.port}`);
  }
);
