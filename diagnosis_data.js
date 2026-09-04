/**
 * 体質診断の設問・タイプ定義・テンプレートデータ
 */

// 1. 流入元選択肢
const SOURCE_OPTIONS = [
  { id: 'youtube', label: 'YouTube（胃弱さん向け動画）' },
  { id: 'x', label: '𝕏 / Twitter（胃弱さん向け発信）' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'other', label: 'その他・知人の紹介など' }
];

// 2. 体質診断 設問一覧 (各タイプ5問、計25問)
const QUESTIONS = [
  // 気虚タイプ
  { id: 'q_kikyo_1', type: 'kikyo', text: '疲れやすく、やる気が出ない' },
  { id: 'q_kikyo_2', type: 'kikyo', text: '食後にひどく眠くなったり、胃もたれしやすい' },
  { id: 'q_kikyo_3', type: 'kikyo', text: '風邪を引きやすく、息切れしやすい' },
  { id: 'q_kikyo_4', type: 'kikyo', text: 'すぐに横になりたがる' },
  { id: 'q_kikyo_5', type: 'kikyo', text: '舌の縁にギザギザした歯型がついている' },

  // 気滞タイプ
  { id: 'q_kitai_1', type: 'kitai', text: 'お腹や胸が張った感じがして苦しい' },
  { id: 'q_kitai_2', type: 'kitai', text: 'ストレスが多く、イライラやため息が出やすい' },
  { id: 'q_kitai_3', type: 'kitai', text: '喉に何かつまったような違和感がある' },
  { id: 'q_kitai_4', type: 'kitai', text: 'ストレスを感じると、ドカ食いするか、逆に食欲が完全になくなる' },
  { id: 'q_kitai_5', type: 'kitai', text: '舌の縁が赤い' },

  // 陰虚タイプ
  { id: 'q_inkyo_1', type: 'inkyo', text: '喉や口が乾きやすく、飲み物をよく欲しがる' },
  { id: 'q_inkyo_2', type: 'inkyo', text: '手足がほてったり、寝汗をかきやすい' },
  { id: 'q_inkyo_3', type: 'inkyo', text: '便がコロコロして硬くなりやすい' },
  { id: 'q_inkyo_4', type: 'inkyo', text: '夜になると足の裏が火照って、布団から出したくなる' },
  { id: 'q_inkyo_5', type: 'inkyo', text: '舌に亀裂（割れ目）があり、苔がほとんどない' },

  // 痰湿タイプ
  { id: 'q_tansitsu_1', type: 'tansitsu', text: '体が重だるく、むくみやすい' },
  { id: 'q_tansitsu_2', type: 'tansitsu', text: '痰が絡みやすかったり、口の中が粘る' },
  { id: 'q_tansitsu_3', type: 'tansitsu', text: '肥満気味で、お腹周りがぽっちゃりしている' },
  { id: 'q_tansitsu_4', type: 'tansitsu', text: '甘いものが大好きだ' },
  { id: 'q_tansitsu_5', type: 'tansitsu', text: '舌の苔が分厚く、ベタベタしている' },

  // 食積タイプ
  { id: 'q_shokushaku_1', type: 'shokushaku', text: '常に胃が張った感じがしたり、ゲップがよく出る' },
  { id: 'q_shokushaku_2', type: 'shokushaku', text: 'お腹が張って苦しいが、ガス（おなら）や便が出ると少しスッキリする' },
  { id: 'q_shokushaku_3', type: 'shokushaku', text: '口臭が気になったり、舌の苔（こけ）が厚い' },
  { id: 'q_shokushaku_4', type: 'shokushaku', text: '食べ過ぎた後、いつまでも胃に物が残る気がする' },
  { id: 'q_shokushaku_5', type: 'shokushaku', text: '早食いの癖があり、よく噛まずに飲み込んでしまう' }
];

// タイプ情報メタデータ
const TYPE_META = {
  kikyo: { name: '気虚（ききょ）', title: 'エネルギー不足・胃腸虚弱タイプ', badge: 'エネルギー低下' },
  kitai: { name: '気滞（きたい）', title: 'ストレス・自律神経緊張タイプ', badge: '気巡り停滞' },
  inkyo: { name: '陰虚（いんきょ）', title: '潤い不足・熱こもりタイプ', badge: 'うるおい不足' },
  tansitsu: { name: '痰湿（たんしつ）', title: '余分な水分停滞・むくみタイプ', badge: '老廃物蓄積' },
  shokushaku: { name: '食積（しょくしゃく）', title: '消化不良・胃もたれタイプ', badge: '未消化残留' }
};

// 診断結果テンプレート集（単一5種 ＋ 混合10種 ＋ 乱れなし1種）
const RESULT_TEMPLATES = {
  // --- 単一タイプ ---
  'kikyo': {
    title: '気虚（ききょ）タイプ',
    subtitle: 'エネルギー（気）が不足し、胃腸がバテている状態',
    description: '胃腸を動かす根本的なエネルギーが不足しているため、食べたものをスムーズに消化・吸収できずに胃もたれや強い疲労感を感じやすくなっています。まずは消化に負担をかけず、元気を補うことが先決です。',
    yakuzen: '【薬膳】気虚さん専用：胃腸を元気にする薬膳ガイド',
    yakuzen_url: 'https://lstep-diagnosis.vercel.app/pdf/yakuzen_kikyo.pdf',
    tubo: '胃の元気を底上げする「足三里・中脘のツボ押し集」',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kikyo.pdf',
    video: '胃腸を元気に動かす！基本の胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-1'
  },
  'kitai': {
    title: '気滞（きたい）タイプ',
    subtitle: 'ストレスで自律神経が緊張し、気の巡りが滞っている状態',
    description: '胃腸は「第二の脳」と呼ばれ、ストレスや緊張のサインをダイレクトに受け止めます。気が滞ることで、胃やお腹の張り、喉の違和感、感情による食欲の乱れが起きています。巡りをスムーズに整えましょう。',
    yakuzen: '香りで巡りを整え、張りを解きほぐす「気滞専用 理気薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/kitai-guide.pdf',
    tubo: 'みぞおちの緊張を緩める「太衝・壇中のツボ押し集」',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kitai.pdf',
    video: '自律神経をリラックスさせて胃を動かす胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-2'
  },
  'inkyo': {
    title: '陰虚（いんきょ）タイプ',
    subtitle: '体内の潤い（津液）が不足し、余分な熱を帯びている状態',
    description: '体を冷まし潤す冷却水が枯渇しかけているため、胃の粘膜が乾燥してデリケートになり、喉の渇きや手足のほてり、便の硬さを招いています。胃に潤いを与えて熱を冷ますアプローチが必要です。',
    yakuzen: '胃の粘膜を守り潤いをチャージする「陰虚専用 滋陰薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/inkyo-guide.pdf',
    tubo: '潤いを補い熱を逃がす「太渓・三陰交のツボ押し集」',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-inkyo.pdf',
    video: '乾いた胃を優しく労わるリラクゼーション胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-3'
  },
  'tansitsu': {
    title: '痰湿（たんしつ）タイプ',
    subtitle: '体内の余分な水分や老廃物が溜まり、ドロドロしている状態',
    description: '胃腸の水分代謝機能が低下し、余分な水分（湿）がヘドロのように胃や全身に停滞しています。体が重だるくむくみやすい、胃がチャポチャポしやすいのが特徴です。余分な湿を追い出すことが大切です。',
    yakuzen: '余分な水分をスッキリ排出する「痰湿専用 利水薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tansitsu-guide.pdf',
    tubo: '胃腸の水分代謝を促進する「豊隆・陰陵泉のツボ押し集」',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-tansitsu.pdf',
    video: 'お腹の巡りを活性化して老廃物を流す胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-4'
  },
  'shokushaku': {
    title: '食積（しょくしゃく）タイプ',
    subtitle: '未消化物が胃腸に滞り、消化不良を起こしている状態',
    description: '食べ過ぎや早食い、胃腸の処理能力を超えた食生活により、胃の中に未消化の食べ物が長くとどまり、ガスやゲップ、口臭、不快な張り感を引き起こしています。胃を休ませ、しっかり消化・排出させましょう。',
    yakuzen: '胃に溜まった焦げ付きを流す「食積専用 消食薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/shokushaku-guide.pdf',
    tubo: '食べたものの排泄をスムーズにする「天枢・下脘のツボ押し集」',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-shokushaku.pdf',
    video: '胃の蠕動（ぜんどう）運動を呼び覚ます胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-5'
  },

  // --- 混合タイプ (10パターン) ---
  'kikyo_kitai': {
    title: '気虚 ＋ 気滞 混合タイプ',
    subtitle: 'エネルギー不足とストレス停滞が重なり、胃が動かない状態',
    description: '胃を動かす力が足りない（気虚）うえに、日々のストレスや緊張で気の巡りがギュッと滞って（気滞）います。「疲れているのにお腹が張って苦しい」「ため息が多く胃も重い」という方に多く見られます。',
    yakuzen: '混合タイプ専用「胃を補いながら巡りをほぐす 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/kikyo-kitai.pdf',
    tubo: '元気を補い気の巡りをスムーズにするツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kikyo-kitai.pdf',
    video: '気虚＋気滞のためのリセット胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-6'
  },
  'kikyo_inkyo': {
    title: '気虚 ＋ 陰虚 混合タイプ',
    subtitle: '胃のエネルギーと潤いの両方が不足しているデリケートな状態',
    description: '胃を動かす「気」と、胃の粘膜を守る「潤い」の双方が枯渇しています。胃もたれしやすく疲れやすいのに、口の渇きや火照りも感じるなど、とても繊細な状態です。無理をせず優しく養生しましょう。',
    yakuzen: '混合タイプ専用「エネルギーと潤いを同時に満たす 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/kikyo-inkyo.pdf',
    tubo: '胃の生命力を底上げして潤すツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kikyo-inkyo.pdf',
    video: '繊細な胃を優しくいたわる胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-7'
  },
  'kikyo_tansitsu': {
    title: '気虚 ＋ 痰湿 混合タイプ',
    subtitle: '胃腸がバテて水分代謝が落ち、余分な湿が溜まった状態',
    description: '胃腸の元気が足りないために水分を処理しきれず、体に余分な水毒（痰湿）が停滞しています。「体がいつも重だるい」「少し食べただけで胃がぽちゃぽちゃする・むくむ」という典型的なパターンです。',
    yakuzen: '混合タイプ専用「胃を強めて余分な水分を追い出す 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/kikyo-tansitsu.pdf',
    tubo: '胃腸を活性化し水分代謝を促すツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kikyo-tansitsu.pdf',
    video: '重だるい胃を軽やかにする胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-8'
  },
  'kikyo_shokushaku': {
    title: '気虚 ＋ 食積 混合タイプ',
    subtitle: '消化する力が弱っているのに、胃に食べ物が残ってしまう状態',
    description: '胃のパワー自体が低下しているため、普通の食事量でも消化しきれず、未消化物が長く残って胃もたれを引き起こしています。「すぐ胃がもたれる」「翌朝まで前の晩の食事が残る」方に多いです。',
    yakuzen: '混合タイプ専用「胃を休め優しく消化を助ける 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/kikyo-shokushaku.pdf',
    tubo: '弱った胃の消化力をやさしく支えるツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kikyo-shokushaku.pdf',
    video: '胃の負担を減らし消化を促す胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-9'
  },
  'kitai_inkyo': {
    title: '気滞 ＋ 陰虚 混合タイプ',
    subtitle: 'ストレスで気が詰まり、体内の熱で潤いが蒸発している状態',
    description: 'イライラや緊張によって生まれた「気滞の熱」が、体内の大切な潤いを焼き、胃の乾燥を招いています。「ストレスがかかると喉が渇く」「胸が苦しく夜に手足がほてる」などの症状が出やすくなります。',
    yakuzen: '混合タイプ専用「胸のつかえを解き、熱を鎮めて潤す 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/kitai-inkyo.pdf',
    tubo: '高ぶる神経を落ち着かせ潤いをチャージするツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kitai-inkyo.pdf',
    video: '自律神経の緊張を解きほぐす胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-10'
  },
  'kitai_tansitsu': {
    title: '気滞 ＋ 痰湿 混合タイプ',
    subtitle: 'ストレスと水毒が合体し、胃や喉に重苦しいつかえがある状態',
    description: '気の巡りが悪いために水分代謝も滞り、ドロドロとした水分が胃や喉に詰まっています。「喉に梅の種が詰まったような違和感（梅核気）」「お腹が張ってガスも溜まり重だるい」状態になりやすいです。',
    yakuzen: '混合タイプ専用「気の巡りと水はけを一気に改善する 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/kitai-tansitsu.pdf',
    tubo: '喉とお腹のつかえを通すツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kitai-tansitsu.pdf',
    video: '巡りとデトックスを加速する胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-11'
  },
  'kitai_shokushaku': {
    title: '気滞 ＋ 食積 混合タイプ',
    subtitle: 'ストレス食いや緊張で胃の出口が固まり、物が詰まった状態',
    description: 'ストレスを感じると早食い・ドカ食いしてしまったり、自律神経の乱れで胃の蠕動運動が止まって消化不良を起こしています。激しい胃の張りやゲップ、食欲の極端な波に悩まされがちです。',
    yakuzen: '混合タイプ専用「胃の緊張を解いて消化を促す 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/kitai-shokushaku.pdf',
    tubo: 'みぞおちの詰まりを押し流すツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-kitai-shokushaku.pdf',
    video: '胃の緊張をリセットして排泄を助ける胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-12'
  },
  'inkyo_tansitsu': {
    title: '陰虚 ＋ 痰湿 混合タイプ',
    subtitle: '局所的な潤い不足と余分な水毒が混在するアンバランスな状態',
    description: '「体の一部は乾燥してほてるのに、下半身やお腹はむくんで水が溜まる」という水分の偏在が起きています。胃の粘膜は潤いを求め、不要な老廃物は排泄を求めているため、絶妙なバランスでのケアが必要です。',
    yakuzen: '混合タイプ専用「正しい水分代謝を取り戻す 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/inkyo-tansitsu.pdf',
    tubo: '水分バランスを整えるツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-inkyo-tansitsu.pdf',
    video: '水はけを整えて胃を正常化する胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-13'
  },
  'inkyo_shokushaku': {
    title: '陰虚 ＋ 食積 混合タイプ',
    subtitle: '潤い不足で熱を持ち、未消化物が胃で焦げ付いている状態',
    description: '体を潤し熱を冷ます「液」が不足しているため、体内が乾燥して熱を持ちやすく、そこに未消化物が停滞することでさらに「熱」が生まれてしまっています。喉の渇き、食後の胃の熱感、コロコロ便を招く原因です。',
    yakuzen: '混合タイプ専用「潤いを守り胃の焦げ付きを流す 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/0uqYxyDZ6twex3XX03QAtXgXX.pdf',
    tubo: '内側の熱を鎮め潤いを守る：黄金のツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/0ZUjuAxVLboR30H7Q0Il4lwXX.pdf',
    video: '乾いた胃を優しく癒やし流す：胃のトレーニング動画4本',
    video_url: 'https://vimeo.com/your-video-id-14'
  },
  'tansitsu_shokushaku': {
    title: '痰湿 ＋ 食積 混合タイプ',
    subtitle: '余分な水分と未消化物が混ざり合い、胃腸が重く詰まった状態',
    description: '甘いものや脂っこいものの食べ過ぎにより、胃の中に未消化物とヘドロ状の水分が溜まり、最も胃腸が重苦しい状態です。常に胃が張ってゲップが出やすく、舌の苔が白く分厚くなりやすいです。',
    yakuzen: '混合タイプ専用「胃の汚れを大掃除して軽やかにする 薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tansitsu-shokushaku.pdf',
    tubo: '強力に胃腸の排泄をサポートするツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-tansitsu-shokushaku.pdf',
    video: '胃の滞りをすっきり解消する胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-15'
  },

  // --- 乱れなしタイプ ---
  'healthy': {
    title: 'バランス良好（健康・未病）タイプ',
    subtitle: '目立った大きな乱れはなく、健やかな胃腸バランスを維持しています',
    description: '現在のところ、気虚・気滞・陰虚・痰湿・食積のいずれも大きな偏りは見られません。素晴らしい状態です！この良好な状態を保つために、季節の変わり目の養生や毎日のメンテナンスを続けていきましょう。',
    yakuzen: '胃腸の健やかさをキープする「毎日の健胃薬膳ガイド」',
    yakuzen_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/healthy-guide.pdf',
    tubo: '日々の疲れを残さない万能メンテナンスツボ押し集',
    tubo_url: 'https://d27rnpuamwvieu.cloudfront.net/pdf/tubo-healthy.pdf',
    video: '健康な胃を一生保つための基本胃のトレーニング動画',
    video_url: 'https://vimeo.com/your-video-id-16'
  }
};

// 共通設定
const SYSTEM_CONFIG = {
  consultation_url: 'https://lin.ee/your-consultation-link', // 個別相談・無料体験面談のリンク
  teacher_name: 'カズ先生（胃の専門家・薬剤師）'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOURCE_OPTIONS, QUESTIONS, TYPE_META, RESULT_TEMPLATES, SYSTEM_CONFIG };
}
