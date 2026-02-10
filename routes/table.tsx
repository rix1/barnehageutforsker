import { getAllKindergartens } from "../db.ts";
import KindergartenTable from "../islands/KindergartenTable.tsx";
import { define } from "../utils.ts";

export default define.page(function TablePage() {
  const data = getAllKindergartens();

  return (
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <KindergartenTable data={data} />
    </div>
  );
});
