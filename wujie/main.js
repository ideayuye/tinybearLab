import { bus, setupApp, preloadApp, startApp, destroyApp } from "wujie";

function register() {
  setupApp({
    name: "test",
    url: "http://localhost:5174/",
    exec: true,
    el: "#app",
    sync: true,
  });

  preloadApp({ name: "test" });

  startApp({ name: "test" });
}

register();
