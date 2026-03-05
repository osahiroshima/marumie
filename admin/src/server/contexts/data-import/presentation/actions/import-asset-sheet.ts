"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/contexts/shared/infrastructure/prisma";
import { AssetSheetLoader } from "@/server/contexts/data-import/infrastructure/asset-sheet/asset-sheet-loader";
import { ImportPortfolioCsvUsecase } from "@/server/contexts/data-import/application/usecases/import-portfolio-csv-usecase";
import { PortfolioCsvLoader } from "@/server/contexts/data-import/infrastructure/portfolio-csv/portfolio-csv-loader";

export interface ImportAssetSheetRequest {
  tsvContent: string;
  snapshotDate: string;
  politicalOrganizationId: string;
}

export type ImportAssetSheetResult =
  | { ok: true; importedCount: number }
  | { ok: false; error: string };

export async function importAssetSheet(
  data: ImportAssetSheetRequest,
): Promise<ImportAssetSheetResult> {
  try {
    const { tsvContent, snapshotDate, politicalOrganizationId } = data;

    if (!tsvContent) {
      return { ok: false, error: "シートの内容が指定されていません" };
    }

    if (!politicalOrganizationId) {
      return { ok: false, error: "政治団体IDが指定されていません" };
    }

    if (!snapshotDate) {
      return { ok: false, error: "スナップショット日付が指定されていません" };
    }

    const sheetLoader = new AssetSheetLoader();
    const records = sheetLoader.load(tsvContent, snapshotDate);

    if (records.length === 0) {
      return { ok: false, error: "インポート可能な行がありません" };
    }

    const csvContent = [
      "category,label,amount,snapshotDate",
      ...records.map(
        (r) => `${r.category},"${r.label}",${r.amount},${r.snapshotDate}`,
      ),
    ].join("\n");

    const csvLoader = new PortfolioCsvLoader();
    const usecase = new ImportPortfolioCsvUsecase(csvLoader, prisma);

    const result = await usecase.execute({
      csvContent,
      politicalOrganizationId,
    });

    revalidatePath("/import-portfolio");

    return { ok: true, importedCount: result.importedCount };
  } catch (error) {
    console.error("Import Asset Sheet error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      return {
        ok: false,
        error:
          "データベースへの保存に失敗しました。時間をおいて再試行してください",
      };
    }

    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "予期しないエラーが発生しました",
    };
  }
}
