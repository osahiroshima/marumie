"use client";
import "client-only";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type {
  ImportAssetSheetRequest,
  ImportAssetSheetResult,
} from "@/server/contexts/data-import/presentation/actions/import-asset-sheet";
import { Input, Label } from "@/client/components/ui";
import { PoliticalOrganizationSelect } from "@/client/components/political-organizations/PoliticalOrganizationSelect";

interface AssetSheetImportClientProps {
  organizations: PoliticalOrganization[];
  importAction: (data: ImportAssetSheetRequest) => Promise<ImportAssetSheetResult>;
}

const FORMAT_DESCRIPTION = `スプレッドシートからコピーしたタブ区切りデータ（TSV）を取り込みます。

必須ヘッダー: 資産クラス, 銘柄, 評価額

対応する資産クラス:
  株式_米国, 株式_日本 → stocks
  現金_JPY, 現金_USD → cash
  貴金属_金, 貴金属_銀, 貴金属_銅, 貴金属_合 → precious_metals
  その他 → other`;

export default function AssetSheetImportClient({
  organizations,
  importAction,
}: AssetSheetImportClientProps) {
  const fileInputId = useId();
  const dateInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [snapshotDate, setSnapshotDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [politicalOrganizationId, setPoliticalOrganizationId] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const importActionRef = useRef(importAction);

  useEffect(() => {
    if (organizations.length > 0 && !politicalOrganizationId) {
      setPoliticalOrganizationId(organizations[0].id);
    }
  }, [organizations, politicalOrganizationId]);

  useEffect(() => {
    importActionRef.current = importAction;
  }, [importAction]);

  const resetFileInput = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!file || !politicalOrganizationId || !snapshotDate) {
      return;
    }

    setIsImporting(true);

    try {
      const tsvContent = await file.text();
      const result = await importActionRef.current({
        tsvContent,
        snapshotDate,
        politicalOrganizationId,
      });

      if (result.ok) {
        toast.success(`${result.importedCount}件のインポートが完了しました`);
        resetFileInput();
      } else {
        toast.error(`インポートに失敗しました: ${result.error}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "インポートに失敗しました";
      toast.error(`インポートに失敗しました: ${errorMessage}`);
    } finally {
      setIsImporting(false);
    }
  }, [file, politicalOrganizationId, snapshotDate, resetFileInput]);

  return (
    <div className="space-y-4">
      <div className="bg-card/50 rounded-lg p-4 space-y-1">
        <p className="text-sm font-semibold text-muted-foreground">資産シート形式</p>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
          {FORMAT_DESCRIPTION}
        </pre>
      </div>

      <PoliticalOrganizationSelect
        organizations={organizations}
        value={politicalOrganizationId}
        onValueChange={setPoliticalOrganizationId}
        required
      />

      <div>
        <Label htmlFor={dateInputId}>スナップショット日付:</Label>
        <Input
          id={dateInputId}
          type="date"
          value={snapshotDate}
          onChange={(e) => setSnapshotDate(e.target.value)}
          className="max-w-xs"
          required
        />
      </div>

      <div>
        <Label htmlFor={fileInputId}>TSV / テキストファイル:</Label>
        <Input
          ref={fileInputRef}
          id={fileInputId}
          className="h-10 border-0 bg-transparent shadow-none file:mr-4 file:h-full file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
          type="file"
          accept=".tsv,.txt,.csv,text/tab-separated-values,text/plain"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>

      {file && (
        <div className="bg-card/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">選択ファイル: {file.name}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleImport}
        disabled={!file || !politicalOrganizationId || !snapshotDate || isImporting}
        className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
      >
        {isImporting ? "インポート中..." : "インポート実行"}
      </button>
    </div>
  );
}
