import { getAllKindergartens } from "../../db.ts";

export const handler = {
  GET(_req: Request) {
    const data = getAllKindergartens();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
