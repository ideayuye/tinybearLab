import { bus, setupApp, preloadApp, startApp, destroyApp } from "wujie";

function register() {
  setupApp({
    name: "test",
    // url: "http://localhost:5173/",
    url: "http://localhost:3000/",
    exec: true,
    el: "#app",
    sync: true,
    attrs: { src: "http://localhost:52042/empty.html" },
  });

  preloadApp({ name: "test" });

  startApp({ name: "test" });
}

register();
