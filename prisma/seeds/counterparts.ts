import type { PrismaClient } from '@prisma/client';
import type { Seeder } from './lib/types';

interface CounterpartSeedData {
  name: string;
  address: string;
  tenantSlug: string;
}

const SAMPLE_PARTY = 'sample-party';
const E2E_TEST_ORG = 'e2e-test-org';

const data: CounterpartSeedData[] = [
  // 収入: 給与支払元
  { name: 'JRキュウシュウコンサルタンツ(株', address: '福岡県福岡市博多区博多駅前三丁目', tenantSlug: SAMPLE_PARTY },

  // 収入: 管理費返金元 / 支出: 管理費支払先
  { name: 'カ)エンチンタイカンリ', address: '福岡県福岡市', tenantSlug: SAMPLE_PARTY },

  // 支出: カード
  { name: 'ラクテンカードサービス', address: '東京都港区南青山二丁目6番21号', tenantSlug: SAMPLE_PARTY },

  // 支出: 後払い決済
  { name: 'DF.ペイデイ', address: '東京都品川区', tenantSlug: SAMPLE_PARTY },

  // 支出: 家賃
  { name: 'ジャックス', address: '東京都渋谷区恵比寿四丁目1番18号', tenantSlug: SAMPLE_PARTY },

  // 支出: 婚活費用
  { name: 'ユ)チアーズ', address: '岡山県岡山市', tenantSlug: SAMPLE_PARTY },

  // 支出: 銀行手数料
  { name: '楽天銀行', address: '東京都港区港南二丁目16番5号', tenantSlug: SAMPLE_PARTY },

  // 収入: 利息
  { name: 'PayPay銀行', address: '東京都新宿区西新宿二丁目1番1号', tenantSlug: SAMPLE_PARTY },

  // 支出: 資料購入
  { name: '関西地図センター', address: '京都府京都市', tenantSlug: SAMPLE_PARTY },

  // E2Eテスト用
  { name: 'E2Eテスト取引先株式会社', address: '東京都渋谷区テスト一丁目1番1号', tenantSlug: E2E_TEST_ORG },
];

export const counterpartsSeeder: Seeder = {
  name: 'Counterparts',
  async seed(prisma: PrismaClient) {
    for (const item of data) {
      const existing = await prisma.counterpart.findFirst({
        where: {
          name: item.name,
          address: item.address,
        },
      });

      if (!existing) {
        const tenant = await prisma.tenant.findFirst({
          where: { slug: item.tenantSlug },
        });
        if (!tenant) {
          console.log(`⚠️  Tenant not found: ${item.tenantSlug}, skipping ${item.name}`);
          continue;
        }

        await prisma.counterpart.create({
          data: {
            name: item.name,
            address: item.address,
            tenantId: tenant.id,
          },
        });
        console.log(`✅ Created: ${item.name}`);
      } else {
        console.log(`⏭️  Already exists: ${item.name}`);
      }
    }
  },
};
