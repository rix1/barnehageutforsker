import { getAllKindergartens } from "../db.ts";
import ExploreView from "../islands/ExploreView.tsx";
import { define } from "../utils.ts";

export default define.page(function ExplorePage() {
  const data = getAllKindergartens();

  return (
    <div class="h-[calc(100vh-3.5rem)]">
      <ExploreView data={data} />
    </div>
  );
});
