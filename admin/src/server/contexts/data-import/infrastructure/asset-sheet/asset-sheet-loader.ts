import "server-only";

import type { PortfolioCsvRecord } from "@/server/contexts/data-import/infrastructure/portfolio-csv/portfolio-csv-loader";

const ASSET_CLASS_CATEGORY_MAP: Record<string, string> = {
  株式_米国: "stocks",
  株式_日本: "stocks",
  現金_JPY: "cash",
  現金_USD: "cash",
  貴金属_金: "precious_metals",
  貴金属_銀: "precious_metals",
  貴金属_銅: "precious_metals",
  貴金属_合: "precious_metals",
  その他: "other",
};

const HEADER_INDEX = {
  assetClass: "資産クラス",
  label: "銘柄",
  amount: "評価額",
} as const;

const MAX_ROWS = 100;

export class AssetSheetLoader {
  load(tsvContent: string, snapshotDate: string): PortfolioCsvRecord[] {
    if (!tsvContent.trim()) {
      return [];
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshotDate)) {
      throw new Error(
        `不正な日付形式です: "${snapshotDate}". YYYY-MM-DD形式で指定してください`,
      );
    }

    const lines = tsvContent.trim().split("\n");

    if (lines.length === 0) {
      return [];
    }

    const headers = lines[0].replace(/\r$/, "").split("\t");

    const assetClassIdx = headers.indexOf(HEADER_INDEX.assetClass);
    const labelIdx = headers.indexOf(HEADER_INDEX.label);
    const amountIdx = headers.indexOf(HEADER_INDEX.amount);

    const missingHeaders: string[] = [];
    if (assetClassIdx === -1) missingHeaders.push(HEADER_INDEX.assetClass);
    if (labelIdx === -1) missingHeaders.push(HEADER_INDEX.label);
    if (amountIdx === -1) missingHeaders.push(HEADER_INDEX.amount);

    if (missingHeaders.length > 0) {
      throw new Error(
        `必須ヘッダーが見つかりません: ${missingHeaders.join(", ")}`,
      );
    }

    const dataLines = lines.slice(1).filter((line) => line.trim());

    if (dataLines.length > MAX_ROWS) {
      throw new Error(`行数が上限（${MAX_ROWS}行）を超えています`);
    }

    const records: PortfolioCsvRecord[] = [];
    let lastAssetClass = "";

    for (const line of dataLines) {
      const cols = line.replace(/\r$/, "").split("\t");

      const rawAssetClass = cols[assetClassIdx]?.trim() || "";
      const label = cols[labelIdx]?.trim() || "";
      const rawAmount = cols[amountIdx]?.trim() || "";

      if (!label) {
        continue;
      }

      const currentAssetClass = rawAssetClass || lastAssetClass;
      if (rawAssetClass) {
        lastAssetClass = rawAssetClass;
      }

      const category = ASSET_CLASS_CATEGORY_MAP[currentAssetClass];
      if (!category) {
        continue;
      }

      const amount = this.parseAmount(rawAmount);
      if (amount <= 0) {
        continue;
      }

      records.push({
        category,
        label,
        amount: String(amount),
        snapshotDate,
      });
    }

    return records;
  }

  private parseAmount(raw: string): number {
    const cleaned = raw.replace(/[¥,\s]/g, "");
    const num = Number(cleaned);
    return Number.isNaN(num) ? 0 : Math.round(num);
  }
}
