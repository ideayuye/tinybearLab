import { Application, Sprite, Assets, Text } from "pixi.js";

(async () => {
  const app = new Application();

  await app.init({ background: "#1099bb", resizeTo: window });

  document.body.appendChild(app.canvas);

  const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

  const bunny = new Sprite(texture);
  app.stage.addChild(bunny);

  bunny.anchor.set(0.5);
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;

  const text = new Text({
    text: "Hello World",
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xff1010,
      align: "center",
    },
  });

  text.x = 20;
  text.y = 30;

  app.stage.addChild(text);

  app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
  });
})();
