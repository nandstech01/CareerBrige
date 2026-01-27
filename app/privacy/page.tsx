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
          <p className="text-sm text-slate-500 mt-2">最終改定日：2024年1月1日</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="prose prose-slate prose-sm max-w-none">
            <p className="text-slate-600 leading-relaxed">
              株式会社エヌアンドエス（以下「当社」といいます。）では、当社の提供するサービス「CareerBridge」（以下、「当社サービス」といいます。）をご利用される皆さまの個人情報を大切に保護することを企業の重要な社会的使命と認識しています。
            </p>
            <p className="text-slate-600 leading-relaxed">
              そのため、当社では、個人情報保護に関する方針を以下のとおり定め、役員、従業員および関係者に周知徹底を図り、常に社会的要請の変化に着目しつつ、個人情報の保護に努めてまいります。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">1. 個人情報の取得、利用及び提供について</h2>
            <p className="text-slate-600">
              当社の全ての事業で取り扱う個人情報及び従業員の個人情報について、適切な取得、利用及び提供を行い、特定した利用目的の達成に必要な範囲を超えて個人情報を取り扱うことはありません。利用目的を超えて個人情報の取り扱いを行う場合には、あらかじめご本人の同意を得ます。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">2. 個人情報に関する法令や指針、規範について</h2>
            <p className="text-slate-600">
              個人情報に関する法令・国が定める指針その他の規範を守ります。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">3. 個人情報の安全管理について</h2>
            <p className="text-slate-600">
              個人情報への不正アクセスや、個人情報の漏えい、紛失、破壊、改ざん等に対して、合理的な防止並びに是正措置を行います。
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

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">2. ユーザーの個人情報等の利用目的</h3>
              <p className="text-slate-600 font-medium mb-2">○本人より直接取得する個人情報</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 mb-4">
                <li>ユーザーのお問い合わせ・相談に対する回答、相談</li>
                <li>ユーザーへのご連絡、お知らせ</li>
                <li>ユーザーの個人認証</li>
                <li>ユーザーが選択された求人掲載企業への提供</li>
                <li>ユーザーの登録情報の確認</li>
                <li>アンケート、キャンペーン、その他情報提供のための連絡</li>
                <li>個人を識別できない形式に加工した上で、統計・分析データを作成</li>
                <li>当社の運営する事業のため、保護措置を講じた上での外部委託</li>
                <li>前各号のほか、本サービスおよび当社が運営するサービスのご提供のため</li>
              </ol>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">3. 第三者への情報提供</h3>
              <p className="text-slate-600 mb-2">
                本サービスについて、ユーザーの就業のため、当社は、ユーザーの同意に基づき、ユーザーの個人情報を以下のとおり提携先企業に提供いたします。
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-2">提供先：Youtopia株式会社</p>
                <p className="text-sm text-slate-600 mb-2">提供する情報：</p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>氏名・性別・年齢・電話番号・メールアドレス</li>
                  <li>都道府県・転居可否・履歴書有無</li>
                  <li>転職温度・LINE ID</li>
                  <li>その他選考活動に必要な情報</li>
                </ul>
                <p className="text-sm text-slate-600 mt-2">提供方法：電子媒体</p>
                <p className="text-sm text-slate-600">利用目的：職業紹介の目的</p>
              </div>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">4. 個人情報処理の外部委託</h3>
              <p className="text-slate-600">
                当社は、個人情報取扱い業務の一部または全部を外部委託することがあります。なお、個人情報の取り扱いを委託する場合は適切な委託先を選定し、個人情報が安全に管理されるよう適切に監督いたします。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">5. 個人情報提供の任意性</h3>
              <p className="text-slate-600">
                当社は、本サービスの利用にあたり、利用目的の達成に必要な個人情報を提供していただきます。必ずしもすべての項目にお答えいただく必要はありませんが、すべての項目にお答えいただけなかった場合、当社の運営するサイトやサービスを一部利用できないことがあります。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">6. Cookieの利用について</h3>
              <p className="text-slate-600">
                当社サービスでは、サービスの品質向上、利用状況の分析のためにCookieを使用しています。Cookieとは、ウェブサイトがお客様のコンピュータに保存する小さなテキストファイルです。お客様はブラウザの設定によりCookieの受け入れを拒否することができますが、その場合、本サービスの一部機能が利用できなくなる可能性があります。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">7. 開示請求のお手続きについて</h3>
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

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">8. 個人情報に関するお問合せ先・苦情の申出先</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  株式会社エヌアンドエス<br />
                  Eメール：info@nands.tech<br />
                  <span className="text-slate-500">【当社のサービスに関するお問合せ先ではございません】</span>
                </p>
              </div>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">9. 同意の撤回について</h3>
              <p className="text-slate-600">
                ユーザーは、いつでも個人情報の第三者提供に関する同意を撤回することができます。同意を撤回される場合は、上記お問合せ先までご連絡ください。なお、同意撤回後は、本サービスの一部をご利用いただけなくなる場合があります。
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
