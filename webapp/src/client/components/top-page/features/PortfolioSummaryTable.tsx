import type { PortfolioData } from "@/server/contexts/public-finance/domain/models/portfolio";

const CATEGORY_LABELS: Record<string, string> = {
  cash: "現金",
  stocks: "株式",
  precious_metals: "金属",
  real_estate: "不動産",
  other: "その他",
};

const CATEGORY_ORDER = ["stocks", "cash", "precious_metals", "real_estate", "other"];

const CATEGORY_COLORS: Record<string, string> = {
  cash: "#5EEAD4",
  stocks: "#2DD4BF",
  precious_metals: "#F59E0B",
  real_estate: "#60A5FA",
  other: "#A78BFA",
};

interface CategorySummary {
  category: string;
  categoryLabel: string;
  amount: number;
  percentage: number;
  color: string;
  assets: { label: string; amount: number }[];
}

function aggregateByCategory(data: PortfolioData): CategorySummary[] {
  const categoryMap = new Map<string, { amount: number; assets: { label: string; amount: number }[] }>();

  for (const asset of data.assets) {
    const existing = categoryMap.get(asset.category);
    if (existing) {
      existing.amount += asset.amount;
      existing.assets.push({ label: asset.label, amount: asset.amount });
    } else {
      categoryMap.set(asset.category, {
        amount: asset.amount,
        assets: [{ label: asset.label, amount: asset.amount }],
      });
    }
  }

  const summaries: CategorySummary[] = [];
  for (const category of CATEGORY_ORDER) {
    const entry = categoryMap.get(category);
    if (!entry) continue;

    summaries.push({
      category,
      categoryLabel: CATEGORY_LABELS[category] ?? category,
      amount: entry.amount,
      percentage: data.totalAmount > 0 ? (entry.amount / data.totalAmount) * 100 : 0,
      color: CATEGORY_COLORS[category] ?? "#9CA3AF",
      assets: entry.assets.sort((a, b) => b.amount - a.amount),
    });
  }

  return summaries;
}

function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

interface PortfolioSummaryTableProps {
  data: PortfolioData;
}

export default function PortfolioSummaryTable({ data }: PortfolioSummaryTableProps) {
  const summaries = aggregateByCategory(data);

  if (summaries.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 px-3 text-left font-semibold text-gray-600">カテゴリ</th>
            <th className="py-2 px-3 text-right font-semibold text-gray-600">バランス</th>
            <th className="py-2 px-3 text-right font-semibold text-gray-600">評価額</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((summary) => (
            <tr key={summary.category} className="border-b border-gray-100">
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: summary.color }}
                  />
                  <div>
                    <span className="font-medium text-gray-800">{summary.categoryLabel}</span>
                    {summary.assets.length > 1 && (
                      <span className="ml-1 text-xs text-gray-400">({summary.assets.length}件)</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-2 px-3 text-right text-gray-700 tabular-nums">
                {summary.percentage.toFixed(1)}%
              </td>
              <td className="py-2 px-3 text-right text-gray-700 tabular-nums">
                {formatYen(summary.amount)}
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-gray-300">
            <td className="py-2 px-3 font-semibold text-gray-800">合計</td>
            <td className="py-2 px-3 text-right font-semibold text-gray-800 tabular-nums">100.0%</td>
            <td className="py-2 px-3 text-right font-semibold text-gray-800 tabular-nums">
              {formatYen(data.totalAmount)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
