import BurnServe from "./../src";

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

// app.get(/.*/, (ctx) => {
//   ctx.sendHTML("Not found");
// });

// app.get(/(.*)\.fly$/, (ctx) => {
//   ctx.sendHTML("API!!!!");
// });

// app.get(/\/public\/(.*)/, (ctx) => {
//   ctx.sendPrettyJson({
//     message: "test",
//     status: 200,
//   });
// });

app.listen(
  {
    port: 3030,
  },
  (opts) => {
    console.log(`Server listening on port ${opts.port}`);
  }
);
