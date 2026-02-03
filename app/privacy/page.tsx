import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">個人情報保護方針（プライバシーポリシー）</h1>
          <p className="text-sm text-slate-500 mt-2">最終改定日：2025年2月1日</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="prose prose-slate prose-sm max-w-none">
            <p className="text-slate-600 leading-relaxed">
              株式会社エヌアンドエス（以下「当社」といいます。）は、当社が開発・運営するSaaS型プラットフォーム「CareerBridge」（以下「本プラットフォーム」といいます。）を通じて取得する個人情報を適切に保護することが社会的責務であると認識し、以下のとおり個人情報保護方針を定めます。
            </p>
            <p className="text-slate-600 leading-relaxed">
              本プラットフォームは、法人のお客様に対しAI技術を活用した応募書類作成支援ツールを提供するものであり、職業紹介事業には該当しません。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">1. 個人情報の取得、利用及び提供について</h2>
            <p className="text-slate-600">
              当社は、適法かつ公正な手段により個人情報を取得し、特定した利用目的の達成に必要な範囲を超えて取り扱うことはありません。利用目的を超えて個人情報を取り扱う場合には、あらかじめご本人の同意を得ます。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">2. 個人情報に関する法令や指針、規範について</h2>
            <p className="text-slate-600">
              個人情報の保護に関する法律その他の関係法令・ガイドラインを遵守します。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">3. 個人情報の安全管理について</h2>
            <p className="text-slate-600">
              個人情報への不正アクセス、漏えい、紛失、破壊、改ざん等に対して、技術的・組織的な安全管理措置を講じます。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">4. 個人情報に関する苦情及び相談について</h2>
            <p className="text-slate-600">
              個人情報に関する苦情及び相談には、速やかに対処します。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">5. 個人情報保護の取り組みについて</h2>
            <p className="text-slate-600">
              個人情報の保護を適切に行うため、継続的にその取り組みを見直し、改善します。
            </p>

            <div className="bg-slate-50 p-4 rounded-lg mt-6">
              <p className="text-sm text-slate-600 font-medium mb-2">＜個人情報保護方針に関するお問合せ先＞</p>
              <p className="text-sm text-slate-600">
                株式会社エヌアンドエス<br />
                Eメール：info@nands.tech
              </p>
            </div>

            {/* CareerBridgeにおける個人情報の取り扱い */}
            <div className="border-t border-slate-200 mt-10 pt-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">CareerBridgeにおける個人情報の取り扱い</h2>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">1. 個人情報取扱事業者</h3>
              <p className="text-slate-600">
                株式会社エヌアンドエス<br />
                Eメール：info@nands.tech
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">2. 本プラットフォームの性質</h3>
              <p className="text-slate-600">
                本プラットフォームは、法人のお客様（人材紹介会社、退職支援事業者等）に対し、AI技術を活用した応募書類作成支援ツールをSaaS形式で提供するサービスです。当社は職業紹介事業を行うものではなく、求人の紹介、応募の斡旋、雇用関係の成立の仲介は行いません。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">3. 取得する個人情報と利用目的</h3>
              <p className="text-slate-600 font-medium mb-2">○法人ユーザーに関する情報</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 mb-4">
                <li>利用登録・アカウント管理のため（会社名、担当者名、メールアドレス等）</li>
                <li>利用料金の請求・決済処理のため</li>
                <li>本サービスに関するご連絡・サポートのため</li>
                <li>本プラットフォームの品質改善・機能向上のための分析のため</li>
              </ol>
              <p className="text-slate-600 font-medium mb-2">○利用者（応募書類作成者）に関する情報</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 mb-4">
                <li>応募書類の作成支援のため（氏名、経歴、学歴、資格等）</li>
                <li>本サービスの提供・運営のため（アカウント情報、操作ログ等）</li>
                <li>個人を識別できない形式に加工した上での、統計・分析データの作成のため</li>
                <li>本プラットフォームのAI機能改善のため（匿名化処理を行った上で利用）</li>
              </ol>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">4. 法人ユーザーへのデータ提供</h3>
              <p className="text-slate-600 mb-2">
                利用者が本プラットフォーム上で入力した情報（応募書類データ、ヒアリング回答等）は、当該利用者を招待した法人ユーザーのワークスペース内で閲覧可能となります。これは本サービスの性質上必要な機能提供であり、利用者が本サービスの利用を開始する際に同意を取得します。
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-2">提供先：利用者を招待した法人ユーザー</p>
                <p className="text-sm text-slate-600 mb-2">閲覧可能な情報：</p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>利用者が入力した応募書類データ（氏名、経歴、学歴、資格等）</li>
                  <li>AIが生成した書類ドラフト</li>
                  <li>セッションのステータス情報</li>
                </ul>
                <p className="text-sm text-slate-600 mt-2">提供方法：本プラットフォーム上のワークスペース機能を通じて</p>
                <p className="text-sm text-slate-600">利用目的：応募書類作成支援サービスの提供のため</p>
              </div>
              <p className="text-slate-600 mt-3 text-sm">
                ※法人ユーザーが取得したデータをどのように利用するか（職業紹介等を含む）については、法人ユーザー自身の責任において、関係法令を遵守して行うものとします。当社は法人ユーザーによるデータの二次利用について責任を負いません。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">5. 第三者提供</h3>
              <p className="text-slate-600">
                当社は、以下の場合を除き、個人情報をご本人の同意なく第三者に提供しません。
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 mt-2">
                <li>法令に基づく場合</li>
                <li>人の生命、身体又は財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>前条に定める法人ユーザーへの提供（利用者の同意に基づく）</li>
              </ol>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">6. 個人情報処理の外部委託</h3>
              <p className="text-slate-600">
                当社は、本サービスの提供に必要な範囲で、個人情報の取扱いの全部又は一部を外部に委託することがあります（クラウドインフラ、AI処理、決済処理等）。委託先の選定にあたっては、個人情報の安全管理が図られるよう適切に監督します。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">7. Cookieの利用について</h3>
              <p className="text-slate-600">
                本プラットフォームでは、サービスの提供・品質向上・利用状況の分析のためにCookieを使用しています。ブラウザの設定によりCookieの受け入れを拒否することができますが、その場合、本サービスの一部機能が利用できなくなる場合があります。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">8. データの保存期間・削除</h3>
              <p className="text-slate-600">
                当社は、利用目的の達成に必要な期間に限り個人情報を保存し、利用目的が達成された後は、法令に基づく保存義務がある場合を除き、合理的な期間内に安全に削除します。法人ユーザーの解約時又は利用者のアカウント削除時には、当社所定の手続きに従いデータの返還又は削除を行います。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">9. 開示請求のお手続きについて</h3>
              <div className="text-slate-600 space-y-2">
                <p><strong>（1）開示等の申出先</strong></p>
                <p className="ml-4">
                  株式会社エヌアンドエス<br />
                  Eメール：info@nands.tech
                </p>
                <p><strong>（2）本人確認方法</strong></p>
                <p className="ml-4">
                  お電話：氏名・電話番号・メールアドレス<br />
                  ご来訪：運転免許証・パスポート等の身分証明書
                </p>
              </div>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">10. 個人情報に関するお問合せ先・苦情の申出先</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  株式会社エヌアンドエス<br />
                  Eメール：info@nands.tech
                </p>
              </div>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">11. 同意の撤回について</h3>
              <p className="text-slate-600">
                利用者は、いつでも個人情報の利用及び法人ユーザーへの提供に関する同意を撤回することができます。同意を撤回される場合は、上記お問合せ先までご連絡ください。なお、同意撤回後は、本サービスの一部又は全部をご利用いただけなくなる場合があります。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} CareerBridge - 株式会社エヌアンドエス</p>
        </div>
      </div>
    </div>
  )
}
