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
          <p className="text-sm text-slate-500 mt-2">最終改定日：2025年2月1日</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="prose prose-slate prose-sm max-w-none">
            <p className="text-slate-600 leading-relaxed">
              株式会社エヌアンドエス（以下、「当社」といいます。）は、当社が開発・運営するSaaS型プラットフォーム「CareerBridge」（以下、「本プラットフォーム」といいます。）の利用条件を以下のとおり定めます（以下、「本規約」といいます。）。
            </p>
            <p className="text-slate-600 leading-relaxed">
              本プラットフォームは、法人のお客様に対し、AI技術を活用した履歴書・職務経歴書等の応募書類作成支援ツールを提供するものであり、職業安定法に定める職業紹介事業には該当しません。当社は求人の紹介、応募の斡旋、雇用関係の成立に関与するものではありません。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第1条（定義）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>「本プラットフォーム」とは、当社が開発・運営するWebサービス「CareerBridge」及びその関連システム一式（管理画面、API、データベース、ログ基盤を含む）をいいます。</li>
              <li>「本サービス」とは、本プラットフォームを通じて当社が提供するAI書類作成支援機能、テンプレート管理機能、ワークスペース管理機能、分析機能その他一切の機能及びサービスの総称をいいます。</li>
              <li>「法人ユーザー」とは、本規約に同意の上、当社所定の手続きにより本サービスの利用登録を完了した法人又は団体をいいます。</li>
              <li>「利用者」とは、法人ユーザーの招待又は案内により、本プラットフォーム上で応募書類の作成支援を受ける個人をいいます。</li>
              <li>「ユーザー」とは、法人ユーザー及び利用者を総称していいます。</li>
              <li>「ワークスペース」とは、法人ユーザーごとに提供される、利用者管理・セッション管理・テンプレート管理等を行うための専用領域をいいます。</li>
              <li>「アカウント」とは、本サービスを利用するために必要なログイン用のメールアドレス及びパスワードをいいます。</li>
              <li>「利用契約」とは、当社と法人ユーザーとの間で成立する、本規約に基づく契約をいいます。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第2条（本サービスの性質）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本サービスは、法人ユーザーに対し、AI技術を活用した応募書類（履歴書・職務経歴書等）の作成支援ツールをSaaS形式で提供するものです。</li>
              <li>当社は、職業紹介事業、労働者派遣事業、又は求人情報提供事業を行うものではなく、本サービスを通じて求人の紹介、応募の斡旋、雇用関係の成立の仲介その他これらに類する行為を行いません。</li>
              <li>法人ユーザーが本プラットフォームを利用して独自に行う事業活動（職業紹介等を含む）については、法人ユーザー自身の責任において、関係法令を遵守して行うものとします。</li>
              <li>本サービスにより生成される応募書類は、AIによる自動生成を含むものであり、その内容の正確性・完全性・特定目的への適合性を当社は保証しません。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第3条（適用）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本規約は、本サービスの利用条件を定めるものであり、全てのユーザーに適用されます。</li>
              <li>当社は、ユーザーへの事前通知をもって、本規約を変更することができます。変更後にユーザーが本サービスを利用した場合、変更後の規約に同意したものとみなします。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第4条（利用登録）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>法人ユーザーとなることを希望する者は、本規約に同意の上、当社所定の登録画面より必要な情報を提供し、利用登録を申請するものとします。</li>
              <li>利用登録の申請者は、真実、完全、正確かつ最新の情報を当社に提供しなければなりません。</li>
              <li>当社は、利用登録の申請を審査し、登録を承認しない場合があります。当社は、不承認の理由を開示する義務を負いません。</li>
              <li>法人ユーザーは、登録情報に変更があった場合、遅滞なく当社所定の手続きにより変更を行うものとします。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第5条（アカウントの管理）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>ユーザーは、自己の責任においてアカウントを管理及び保管するものとし、これを第三者に開示、貸与、譲渡、名義変更、又は売買等をしてはならないものとします。</li>
              <li>法人ユーザーは、自社のワークスペースに所属するアカウントの管理について責任を負うものとします。</li>
              <li>アカウントの管理不十分、使用上の過誤又は第三者の使用等によってユーザーに何らかの損害が生じたとしても、当社は一切の責任を負いません。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第6条（利用料金）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本サービスの利用料金は、当社が別途定める料金表又は個別契約に従うものとします。</li>
              <li>当社は、法人ユーザーへの事前通知をもって、利用料金を変更することができます。</li>
              <li>無料トライアル期間又はモニタープログラム期間中は、当社が別途定める範囲で本サービスを無料で利用できるものとします。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第7条（禁止事項）</h2>
            <p className="text-slate-600 mb-2">当社は、ユーザーが以下の行為を行うことを禁止します。</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本規約又は法令等に違反する行為又はそのおそれのある行為</li>
              <li>公序良俗に反する行為</li>
              <li>虚偽又は誤りを含む情報を本プラットフォーム上で送信する行為</li>
              <li>当社、他のユーザー又はその他の第三者の権利を侵害する行為</li>
              <li>本プラットフォームの運営を妨げるおそれのある行為（不正アクセス、過度なAPI呼び出し等を含む）</li>
              <li>本プラットフォームのリバースエンジニアリング、逆コンパイル又は逆アセンブル</li>
              <li>本サービスを第三者に再販売、転貸又は有償提供する行為（当社の書面承諾がある場合を除く）</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第8条（データの取扱い）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本プラットフォーム上で法人ユーザー又は利用者が入力・登録したデータ（応募書類データ、ヒアリングデータ等）の管理責任は、法人ユーザーが負うものとします。</li>
              <li>当社は、本サービスの品質改善・機能向上のため、匿名化・統計化した利用データを分析に利用することがあります。</li>
              <li>個人情報の取扱いについては、別途「<Link href="/privacy" className="text-green-600 hover:underline">プライバシーポリシー</Link>」に定めるとおりとします。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第9条（知的財産権）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>本プラットフォーム及びその関連ソフトウェア、コンテンツ（テンプレート、UIデザイン、アルゴリズム等を含む）に関する知的財産権は、当社又は当社にライセンスを付与している者に帰属します。</li>
              <li>法人ユーザー又は利用者が本プラットフォーム上で作成した応募書類データに関する権利は、当該法人ユーザー又は利用者に帰属します。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第10条（免責）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>当社は、本サービスにより生成される応募書類の内容、品質、正確性、最新性、有用性、特定目的への適合性、完全性、合法性その他一切の事項について保証しません。</li>
              <li>当社は、本サービスの停止・中断・中止、内容や仕様の変更、又は提供の終了によってユーザーに損害が生じたとしても一切の責任を負いません。</li>
              <li>当社は、法人ユーザーが本プラットフォームを利用して行う事業活動の結果について一切の責任を負いません。</li>
              <li>当社は、利用者の就職・転職その他の求職活動の成否について一切の関与及び責任を負いません。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第11条（サービスの変更・終了）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>当社は、当社が必要と判断した場合、ユーザーへの事前通知をもって、本サービスの内容又は仕様を変更することができます。</li>
              <li>当社は、当社が必要と判断した場合、ユーザーへの事前通知をもって、本サービスの提供を終了することができます。</li>
              <li>本サービス終了時のデータの取扱い（返還・削除等）については、当社が別途定める手続きに従うものとします。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第12条（退会・解約）</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>法人ユーザーは、当社所定の手続きにより、利用契約を解約することができます。</li>
              <li>利用者は、当社所定の手続きにより、アカウントを削除することができます。</li>
              <li>解約又はアカウント削除後は、当該アカウントに関連するデータにアクセスできなくなります。当社は、法令又は本規約に別段の定めがある場合を除き、解約後合理的な期間内にデータを削除します。</li>
            </ol>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第13条（損害賠償）</h2>
            <p className="text-slate-600">
              当社がユーザーに対して損害賠償責任を負う場合、その賠償額は、直接かつ通常の損害に限り、当該ユーザーが過去3か月間に当社に支払った利用料金の総額を上限とします。ただし、当社の故意又は重過失による場合はこの限りではありません。
            </p>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-4">第14条（準拠法及び管轄裁判所）</h2>
            <p className="text-slate-600">
              本規約は日本法を準拠法とし、本規約に関する一切の紛争については、大津地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
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
