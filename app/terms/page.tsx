import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">CareerBridge 利用規約</h1>
          <p className="text-sm text-slate-500 mt-2">最終改定日：2024年1月1日</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="prose prose-slate prose-sm max-w-none">
            <p className="text-slate-600 leading-relaxed">
              株式会社エヌアンドエス（以下、「当社」といいます。）は、当社が提供する「CareerBridge」および「CareerBridgeエージェント」ならびにこれらに付随して提供するサービス（以下、これらを総称して「本サービス」といいます。）をユーザーへ提供するにあたり、CareerBridge利用規約を以下のとおり定めます。
            </p>
            <p className="text-slate-600 leading-relaxed">
              なお、本サービスを利用（第１条で定義します。）した場合には、以下のCareerBridge利用規約に同意したものとみなされますので、本サービスを利用する前に、本CareerBridge利用規約を注意深くお読みください。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第1条（定義）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>「本サービス」とは、ウェブサイトや専用アプリを通じて提供される、求人案件についての情報提供サービスおよび応募方法提供サービス、本サービスと一体をなす本サービスの付随サービス（LINE等のSNSアカウントを通じたものを含む）、それらに関連するサービスならびにその他一切のサービスの総称です。</li>
              <li>「ユーザー」とは、本サービスを利用するすべての方をいいます。</li>
              <li>「利用」とは、本サービスにおいて当社から提供される一切の情報についてその一部でも閲覧する行為、当社から提供される求人案件に応募する行為等その他本サービス上もしくは本サービスを通じて行う一切の情報送信行為、ならびにその他本サービスを通じてユーザーが行う一切の活動をいいます。</li>
              <li>「本契約」とは、当社とユーザーの間で成立する、本規約に基づく利用契約をいいます。</li>
              <li>「会員」とは、ユーザーのうち会員登録を完了した者をいいます。</li>
              <li>「アカウント」とは、会員として本サービスを利用するために必要なログイン用のメールアドレスおよびパスワードのことをいいます。</li>
              <li>「会員情報」とは、ユーザーが会員登録の申請をするにあたり当社が求める一切の情報をいいます。</li>
              <li>「登録情報」とは、会員情報を含む会員が当社に提供した当該会員についての一切の情報をいいます。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第2条（適用）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本規約は、求人案件についての情報提供、応募方法の提供等、本サービスの利用条件を定めるものであり、本サービスの全てのユーザーに適用されるものとします。</li>
              <li>当社は、ユーザーの承諾を得ることなく、本規約を随時変更することができます。当社は、本規約を変更した場合には、ユーザーにその旨通知するものとし、当該通知の効力発生後、ユーザーが本サービスを利用した場合には、ユーザーは、本規約の変更に同意したものとみなされます。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第3条（当社および求人企業からの通知・連絡）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>当社は、本サービスの専用ウェブサイト上に表示することにより、利用者に対し随時必要な事項を通知します。</li>
              <li>当社および求人企業は、本サービスを提供する際に、ユーザーに対し、Eメール、SMS、LINE、電話等によって連絡をすることができます。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第4条（本サービス利用資格）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本サービスは、本規約にご同意いただける方のみが利用できるものとし、ユーザーが本サービスを利用した場合、本規約に同意したものとみなされます。</li>
              <li>会員専用のサービスは、当該会員本人に限り、当社の定める条件に従って利用できるものとします。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第5条（会員登録）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>ユーザーは、本規約に同意したうえで本サービス所定の登録画面より会員情報を当社に提供することにより、当社に対し本サービスの会員登録を申請することができます。</li>
              <li>ユーザーは、会員登録の申請にあたり、真実、完全、正確かつ最新の情報を当社に提供しなければなりません。</li>
              <li>会員は、登録情報に変更があった場合は、遅滞なく当社の定める手続きにより、登録情報の変更を行うものとします。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第6条（アカウントの管理）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>会員は、自己の責任においてアカウントを管理および保管するものとし、これを第三者に開示、貸与、譲渡、名義変更、または売買等をしてはならないものとします。</li>
              <li>アカウントの管理不十分、使用上の過誤または第三者の使用等によってユーザーに何らかの損害が生じたとしても、当社は一切の責任を負いません。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第7条（退会）</h2>
            <p className="text-slate-600">
              ユーザーは、当社の定める退会手続きを行うことにより、退会することができるものとします。なお、退会後は、再度会員登録を行った場合でも、退会前の登録情報は引き継がれず、退会前のアカウントを使用できません。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第8条（禁止事項）</h2>
            <p className="text-slate-600 mb-2">当社は、ユーザーが以下の行為を行うことを禁止します。</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本規約または法令等に違反する行為またはそのおそれのある行為</li>
              <li>公序良俗に反する行為、社会常識・通念を逸脱した行為</li>
              <li>虚偽または誤りを含む情報を本サービス内または本サービスを通じて送信する行為</li>
              <li>当社、他のユーザー、求人企業およびその他の第三者の権利を侵害する行為</li>
              <li>当社、他のユーザー、求人企業およびその他の第三者を誹謗中傷する行為</li>
              <li>本サービスの運営を妨げるおそれのある一切の行為</li>
              <li>その他、当社が不適切と判断する一切の行為</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第9条（個人情報保護に関する事項）</h2>
            <p className="text-slate-600">
              本サービスにおける個人情報の取扱いについては、「<Link href="/privacy" className="text-green-600 hover:underline">CareerBridgeにおける個人情報の取り扱い</Link>」に記載のとおりです。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第10条（免責）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>当社は、本サービス上の求人案件についての情報等その他本サービス上または本サービスを通じて当社・求人企業・その他の第三者が提供する一切の情報に関する、正確性、最新性、有用性、適合性、完全性、安全性、合法性およびその他一切の事由について保証しません。</li>
              <li>当社は本サービスの停止・中断・中止、内容や仕様の変更、または提供の終了によってユーザーに何らかの損害が生じたとしても一切の責任を負いません。</li>
              <li>当社は、ユーザーによる本サービスの利用によって、就職・転職が成功することを保証するものではありません。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第11条（サービスの変更、終了）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>当社は、当社が必要であると判断した場合には、ユーザーに事前に通知することなく、いつでも、本サービスの内容や仕様を変更することができます。</li>
              <li>当社は、当社が必要であると判断した場合には、いつでも、本サービスの提供を終了することができます。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第12条（準拠法および管轄裁判所）</h2>
            <p className="text-slate-600">
              本サービスに関する一切については日本法に準拠して解釈されるものとし、本規約に関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>

            {/* 職業紹介サービスに関する附則 */}
            <div className="border-t border-slate-200 mt-10 pt-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">職業紹介サービスに関する附則</h2>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">第1条（サービスの内容）</h3>
              <p className="text-slate-600">
                「職業紹介サービス」とは、当社が運営するウェブサイト「CareerBridge」を通じた求職・求人、及び、それに関連するサービスを利用目的とするサービスの総称をいいます。本サービスでは、提携先であるYoutopia株式会社様の求人情報をご案内しております。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">第2条（第三者への情報提供）</h3>
              <p className="text-slate-600">
                ユーザーが本サービスを通じて応募した場合、ユーザーの同意に基づき、お名前、連絡先、希望職種等の情報をYoutopia株式会社様に提供します。Youtopia株式会社様が職業紹介の目的でこれらの情報を利用し、ユーザーに直接連絡する場合があります。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">第3条（取扱職種の範囲）</h3>
              <p className="text-slate-600">職種：全職種<br />地域：国内全域</p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">第4条（手数料に関する事項）</h3>
              <p className="text-slate-600">
                当社は、ユーザー（求職者）から手数料を申し受けることは一切ございません。
              </p>

              <h3 className="text-base font-bold text-slate-800 mt-6 mb-3">第5条（苦情の処理に関する事項）</h3>
              <p className="text-slate-600">
                苦情の申出先<br />
                株式会社エヌアンドエス　顧客相談窓口<br />
                Eメール：info@nands.tech
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
