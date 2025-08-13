// /app/search-product/page.tsx

import { Suspense } from "react";
import SearchProducts from "@/components/search/SearchResult";

export default function SearchProductPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchProducts />
    </Suspense>
  );
}
