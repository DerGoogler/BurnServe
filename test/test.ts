// main.ts
import { BurnServe } from "./../src";
import { PPContext } from "./PPContex";

const app = new BurnServe<PPContext>({
  context: PPContext,
});

// Exclude public from any rotung
app.getAR(["public"], ctx => {
  ctx.log("Test log");
  ctx.sendHTML("Im' up!");
});

app.get(/\/public\/.*/, ctx => {
  ctx.sendHTML("Public folder");
});

app.listen({
  port: 3030,
});
