import "server-only";

import { loadPoliticalOrganizationsData } from "@/server/contexts/shared/presentation/loaders/load-political-organizations-data";
import { importPortfolioCsv } from "@/server/contexts/data-import/presentation/actions/import-portfolio-csv";
import { importAssetSheet } from "@/server/contexts/data-import/presentation/actions/import-asset-sheet";
import PortfolioImportTabs from "@/client/components/portfolio-csv-import/PortfolioImportTabs";

export default async function ImportPortfolioPage() {
  const organizations = await loadPoliticalOrganizationsData();

  return (
    <div className="bg-card rounded-xl p-4">
      <h1 className="text-2xl font-bold text-white mb-6">ポートフォリオ資産インポート</h1>
      <PortfolioImportTabs
        organizations={organizations}
        importCsvAction={importPortfolioCsv}
        importAssetSheetAction={importAssetSheet}
      />
    </div>
  );
}
