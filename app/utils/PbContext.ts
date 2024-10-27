import PocketBase from "pocketbase";

let pb: PocketBase;

declare global {
  var __pocketbase: PocketBase | undefined;
}

if (process.env.NODE_ENV === "production") {
  pb = new PocketBase(process.env.POCKETBASE_URL);
} else {
  if (!global.__pocketbase) {
    global.__pocketbase = new PocketBase(process.env.POCKETBASE_URL);
  }
  pb = global.__pocketbase;
}

export { pb };
