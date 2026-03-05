"use client";
import "client-only";

import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type {
  ImportPortfolioCsvRequest,
  ImportPortfolioCsvResult,
} from "@/server/contexts/data-import/presentation/actions/import-portfolio-csv";
import type {
  ImportAssetSheetRequest,
  ImportAssetSheetResult,
} from "@/server/contexts/data-import/presentation/actions/import-asset-sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/client/components/ui";
import PortfolioCsvImportClient from "@/client/components/portfolio-csv-import/PortfolioCsvImportClient";
import AssetSheetImportClient from "@/client/components/portfolio-csv-import/AssetSheetImportClient";

interface PortfolioImportTabsProps {
  organizations: PoliticalOrganization[];
  importCsvAction: (data: ImportPortfolioCsvRequest) => Promise<ImportPortfolioCsvResult>;
  importAssetSheetAction: (data: ImportAssetSheetRequest) => Promise<ImportAssetSheetResult>;
}

export default function PortfolioImportTabs({
  organizations,
  importCsvAction,
  importAssetSheetAction,
}: PortfolioImportTabsProps) {
  return (
    <Tabs defaultValue="csv">
      <TabsList className="mb-4">
        <TabsTrigger value="csv">CSV形式</TabsTrigger>
        <TabsTrigger value="asset-sheet">資産シート（TSV）</TabsTrigger>
      </TabsList>
      <TabsContent value="csv">
        <PortfolioCsvImportClient
          organizations={organizations}
          importAction={importCsvAction}
        />
      </TabsContent>
      <TabsContent value="asset-sheet">
        <AssetSheetImportClient
          organizations={organizations}
          importAction={importAssetSheetAction}
        />
      </TabsContent>
    </Tabs>
  );
}
