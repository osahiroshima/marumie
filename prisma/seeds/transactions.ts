import type { DonorType, PrismaClient } from '@prisma/client';
import type { Seeder } from './lib/types';

interface TransactionSeedData {
  orgSlug: string;
  transactionNo: string;
  transactionDate: string;
  transactionType: 'income' | 'expense';
  debitAccount: string;
  debitAmount: string;
  creditAccount: string;
  creditAmount: string;
  description: string;
  categoryKey: string;
  counterpartName?: string;
  donorName?: string;
  donorAddress?: string;
  donorType?: DonorType;
  friendlyCategory?: string;
  isGrantExpenditure?: boolean; // 交付金に係る支出フラグ（支出のみ）
}

// ============================================================
// 実際の収支データに基づくサンプルトランザクション
//
// 除外対象:
// - 楽天証券マネーブリッジ（自動スイープ・国内株式買付代金）
// - 現物貴金属投資（金貨購入など）
// - クレカ引当金の入出金
// ============================================================
const data: TransactionSeedData[] = [
  // ========================================
  // 収入: 給与収入
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0001',
    transactionDate: '2025-01-13',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '87200',
    creditAccount: 'その他の収入',
    creditAmount: '87200',
    description: '給与 JRキュウシュウコンサルタンツ(株',
    categoryKey: 'other-income',
    counterpartName: 'JRキュウシュウコンサルタンツ(株',
    friendlyCategory: '給与収入',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0002',
    transactionDate: '2025-01-16',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '39680',
    creditAccount: 'その他の収入',
    creditAmount: '39680',
    description: '給与 JRキュウシュウコンサルタンツ(株',
    categoryKey: 'other-income',
    counterpartName: 'JRキュウシュウコンサルタンツ(株',
    friendlyCategory: '給与収入',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0003',
    transactionDate: '2025-01-23',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '299219',
    creditAccount: 'その他の収入',
    creditAmount: '299219',
    description: '給与 JRキュウシュウコンサルタンツ(株',
    categoryKey: 'other-income',
    counterpartName: 'JRキュウシュウコンサルタンツ(株',
    friendlyCategory: '給与収入',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0004',
    transactionDate: '2025-02-16',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '69800',
    creditAccount: 'その他の収入',
    creditAmount: '69800',
    description: '給与 JRキュウシュウコンサルタンツ(株',
    categoryKey: 'other-income',
    counterpartName: 'JRキュウシュウコンサルタンツ(株',
    friendlyCategory: '給与収入',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0005',
    transactionDate: '2025-02-25',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '263269',
    creditAccount: 'その他の収入',
    creditAmount: '263269',
    description: '給与 JRキュウシュウコンサルタンツ(株',
    categoryKey: 'other-income',
    counterpartName: 'JRキュウシュウコンサルタンツ(株',
    friendlyCategory: '給与収入',
  },

  // ========================================
  // 収入: 管理費返金
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0006',
    transactionDate: '2025-02-27',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '90821',
    creditAccount: 'その他の収入',
    creditAmount: '90821',
    description: 'カ)エンチンタイカンリ 管理費返金',
    categoryKey: 'other-income',
    counterpartName: 'カ)エンチンタイカンリ',
    friendlyCategory: '管理費返金',
  },

  // ========================================
  // 収入: 交通費返金
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0007',
    transactionDate: '2025-01-03',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '8200',
    creditAccount: 'その他の収入',
    creditAmount: '8200',
    description: 'スマートEX(JR西日本) 払い戻し',
    categoryKey: 'other-income',
    friendlyCategory: '交通費返金',
  },

  // ========================================
  // 収入: 受取利息
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0008',
    transactionDate: '2025-01-01',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '57',
    creditAccount: 'その他の収入',
    creditAmount: '57',
    description: '決算お利息 12月分',
    categoryKey: 'other-income',
    counterpartName: 'PayPay銀行',
    friendlyCategory: '受取利息',
  },

  // ========================================
  // 支出: カード引き落とし（日常経費の一括支払い）
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0009',
    transactionDate: '2025-01-27',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '919322',
    creditAccount: '普通預金',
    creditAmount: '919322',
    description: 'ラクテンカードサービス カード引き落とし',
    categoryKey: 'other-expenses',
    counterpartName: 'ラクテンカードサービス',
    friendlyCategory: 'カード支払い',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0010',
    transactionDate: '2025-02-27',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '818454',
    creditAccount: '普通預金',
    creditAmount: '818454',
    description: 'ラクテンカードサービス カード引き落とし',
    categoryKey: 'other-expenses',
    counterpartName: 'ラクテンカードサービス',
    friendlyCategory: 'カード支払い',
  },

  // ========================================
  // 支出: 後払い決済
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0011',
    transactionDate: '2025-01-27',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '18222',
    creditAccount: '普通預金',
    creditAmount: '18222',
    description: 'DF.ペイデイ 後払い決済',
    categoryKey: 'other-expenses',
    counterpartName: 'DF.ペイデイ',
    friendlyCategory: '後払い決済',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0012',
    transactionDate: '2025-02-27',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '18222',
    creditAccount: '普通預金',
    creditAmount: '18222',
    description: 'DF.ペイデイ 後払い決済',
    categoryKey: 'other-expenses',
    counterpartName: 'DF.ペイデイ',
    friendlyCategory: '後払い決済',
  },

  // ========================================
  // 支出: 家賃（ジャックス・ローン）
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0013',
    transactionDate: '2025-01-27',
    transactionType: 'expense',
    debitAccount: '事務所費',
    debitAmount: '109529',
    creditAccount: '普通預金',
    creditAmount: '109529',
    description: 'ジャックス 家賃',
    categoryKey: 'office-expenses',
    counterpartName: 'ジャックス',
    friendlyCategory: '家賃',
  },

  // ========================================
  // 支出: 管理費
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0014',
    transactionDate: '2025-01-20',
    transactionType: 'expense',
    debitAccount: '事務所費',
    debitAmount: '44000',
    creditAccount: '普通預金',
    creditAmount: '44000',
    description: 'カ)エンチンタイカンリ 管理費',
    categoryKey: 'office-expenses',
    counterpartName: 'カ)エンチンタイカンリ',
    friendlyCategory: '管理費',
  },

  // ========================================
  // 支出: ATM引き出し（生活費）
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0015',
    transactionDate: '2025-01-26',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '50000',
    creditAccount: '普通預金',
    creditAmount: '50000',
    description: 'PayPay銀行振込 ATM引き出し',
    categoryKey: 'other-expenses',
    friendlyCategory: '現金引き出し',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0016',
    transactionDate: '2025-01-26',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '127000',
    creditAccount: '普通預金',
    creditAmount: '127000',
    description: 'ATM出金 Enet',
    categoryKey: 'other-expenses',
    friendlyCategory: '現金引き出し',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0017',
    transactionDate: '2025-01-26',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '34000',
    creditAccount: '普通預金',
    creditAmount: '34000',
    description: 'ATM出金 Enet',
    categoryKey: 'other-expenses',
    friendlyCategory: '現金引き出し',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0018',
    transactionDate: '2025-01-26',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '20000',
    creditAccount: '普通預金',
    creditAmount: '20000',
    description: 'PayPay銀行振込',
    categoryKey: 'other-expenses',
    friendlyCategory: '現金引き出し',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0019',
    transactionDate: '2025-01-28',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '45000',
    creditAccount: '普通預金',
    creditAmount: '45000',
    description: 'ATM出金 ゆうちょ銀行',
    categoryKey: 'other-expenses',
    friendlyCategory: '現金引き出し',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0020',
    transactionDate: '2025-02-26',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '50000',
    creditAccount: '普通預金',
    creditAmount: '50000',
    description: 'PayPay銀行振込 ATM引き出し',
    categoryKey: 'other-expenses',
    friendlyCategory: '現金引き出し',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0021',
    transactionDate: '2025-02-26',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '40000',
    creditAccount: '普通預金',
    creditAmount: '40000',
    description: 'PayPay銀行振込 ATM引き出し',
    categoryKey: 'other-expenses',
    friendlyCategory: '現金引き出し',
  },

  // ========================================
  // 支出: 婚活成婚退会費用
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0022',
    transactionDate: '2025-01-30',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '275000',
    creditAccount: '普通預金',
    creditAmount: '275000',
    description: 'ユ)チアーズ 婚活成婚退会費用',
    categoryKey: 'other-expenses',
    counterpartName: 'ユ)チアーズ',
    friendlyCategory: 'その他支出',
  },

  // ========================================
  // 支出: 手数料
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0023',
    transactionDate: '2025-01-30',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '145',
    creditAccount: '普通預金',
    creditAmount: '145',
    description: '振込手数料',
    categoryKey: 'other-expenses',
    counterpartName: '楽天銀行',
    friendlyCategory: '手数料',
  },
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0024',
    transactionDate: '2025-01-28',
    transactionType: 'expense',
    debitAccount: 'その他の経費',
    debitAmount: '275',
    creditAccount: '普通預金',
    creditAmount: '275',
    description: 'ATMカード手数料',
    categoryKey: 'other-expenses',
    counterpartName: '楽天銀行',
    friendlyCategory: '手数料',
  },

  // ========================================
  // 支出: 交通費
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0025',
    transactionDate: '2025-01-01',
    transactionType: 'expense',
    debitAccount: '組織活動費',
    debitAmount: '8200',
    creditAccount: '普通預金',
    creditAmount: '8200',
    description: 'スマートEX(JR西日本) 新幹線',
    categoryKey: 'organizational-activities',
    friendlyCategory: '交通費',
  },

  // ========================================
  // 支出: 資料購入
  // ========================================
  {
    orgSlug: 'sample-party',
    transactionNo: 'T2026-0026',
    transactionDate: '2025-01-09',
    transactionType: 'expense',
    debitAccount: '備品・消耗品費',
    debitAmount: '10140',
    creditAccount: '普通預金',
    creditAmount: '10140',
    description: '関西地図センター 地図資料購入',
    categoryKey: 'equipment-supplies',
    counterpartName: '関西地図センター',
    friendlyCategory: '資料購入',
  },

  // E2Eテスト用トランザクション
  // 寄附トランザクション（Donor紐付け確認用）
  {
    orgSlug: 'e2e-test-org',
    transactionNo: 'E2E-0001',
    transactionDate: '2025-06-01',
    transactionType: 'income',
    debitAccount: '普通預金',
    debitAmount: '50000',
    creditAccount: '個人からの寄附',
    creditAmount: '50000',
    description: 'E2Eテスト個人寄附',
    categoryKey: 'individual-donations',
    donorName: 'E2Eテスト寄附太郎',
    donorAddress: '東京都渋谷区テスト二丁目2番2号',
    donorType: 'individual',
  },
  // 支出トランザクション（Counterpart紐付け確認用）
  {
    orgSlug: 'e2e-test-org',
    transactionNo: 'E2E-0002',
    transactionDate: '2025-06-15',
    transactionType: 'expense',
    debitAccount: '備品・消耗品費',
    debitAmount: '30000',
    creditAccount: '普通預金',
    creditAmount: '30000',
    description: 'E2Eテスト備品購入',
    categoryKey: 'equipment-supplies',
    counterpartName: 'E2Eテスト取引先株式会社',
  },
];

export const transactionsSeeder: Seeder = {
  name: 'Transactions',
  async seed(prisma: PrismaClient) {
    for (const item of data) {
      // orgSlugでorganizationを取得
      const organization = await prisma.politicalOrganization.findFirst({
        where: { slug: item.orgSlug },
      });

      if (!organization) {
        console.log(`⚠️  Warning: Organization "${item.orgSlug}" not found - skipping ${item.transactionNo}`);
        continue;
      }

      // 既存チェック
      const existing = await prisma.transaction.findFirst({
        where: {
          politicalOrganizationId: organization.id,
          transactionNo: item.transactionNo,
        },
      });

      if (existing) {
        console.log(`⏭️  Already exists: ${item.transactionNo}`);
        continue;
      }

      // Counterpartの取得（存在する場合）
      let counterpartId: bigint | undefined;
      if (item.counterpartName) {
        const counterpart = await prisma.counterpart.findFirst({
          where: { name: item.counterpartName },
        });
        if (counterpart) {
          counterpartId = counterpart.id;
        } else {
          console.log(`⚠️  Warning: Counterpart "${item.counterpartName}" not found`);
        }
      }

      // Donorの取得（存在する場合）
      // name, address, donorTypeの3要素で検索
      let donorId: bigint | undefined;
      if (item.donorName && item.donorAddress && item.donorType) {
        const donor = await prisma.donor.findFirst({
          where: {
            name: item.donorName,
            address: item.donorAddress,
            donorType: item.donorType,
          },
        });
        if (donor) {
          donorId = donor.id;
        } else {
          console.log(
            `⚠️  Warning: Donor "${item.donorName}" (${item.donorAddress}, ${item.donorType}) not found`,
          );
        }
      }

      // Transactionの作成
      const transaction = await prisma.transaction.create({
        data: {
          politicalOrganizationId: organization.id,
          transactionNo: item.transactionNo,
          transactionDate: new Date(item.transactionDate),
          financialYear: 2025,
          transactionType: item.transactionType,
          debitAccount: item.debitAccount,
          debitAmount: item.debitAmount,
          creditAccount: item.creditAccount,
          creditAmount: item.creditAmount,
          description: item.description,
          categoryKey: item.categoryKey,
          friendlyCategory: item.friendlyCategory,
          isGrantExpenditure: item.isGrantExpenditure ?? false,
        },
      });

      // TransactionCounterpartの作成（counterpartIdが存在する場合）
      if (counterpartId) {
        await prisma.transactionCounterpart.create({
          data: {
            transactionId: transaction.id,
            counterpartId: counterpartId,
          },
        });
      }

      // TransactionDonorの作成（donorIdが存在する場合）
      if (donorId) {
        await prisma.transactionDonor.create({
          data: {
            transactionId: transaction.id,
            donorId: donorId,
          },
        });
      }

      console.log(`✅ Created: ${item.transactionNo} - ${item.description}`);
    }
  },
};
