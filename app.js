// JavaScript Logic for Minis Piercing Guwol Homepage

// Ear Piercing Placement Information Database (Multilingual)
const PIERCING_INFO = {
  lobe: {
    ko: { name: "귓볼", healing: "4 ~ 6주", pain: 1, desc: "가장 기본적이고 통증이 가장 적은 부위입니다. 피어싱 입문자에게 강력히 추천하며, 다양한 크기와 형태의 귀걸이나 피어싱을 연출하기 좋습니다. 남녀노소 불문하고 가장 사랑받는 부위입니다.", tip: "시술 후 씻을 때 물기가 남지 않게 드라이어(찬바람)로 잘 말려주시면 덧나지 않고 예쁘게 아뭅니다." },
    en: { name: "Lobe", healing: "4 ~ 6 weeks", pain: 1, desc: "The most basic and least painful area. Highly recommended for beginners. Perfect for styling various sizes and shapes of earrings or piercings. Loved by people of all ages.", tip: "Blow dry with cool air after washing to keep it clean and help it heal beautifully without irritation." },
    ja: { name: "耳たぶ (Lobe)", healing: "4 〜 6週間", pain: 1, desc: "最も基本的で最も痛みの少ない部位です。ピアッシング初心者の方に強力におすすめします。様々なサイズや形のピアスを楽しめる、男女問わず最も愛される部位です。", tip: "洗顔や入浴後は冷風のドライヤーで湿気を飛ばして乾かすと、トラブルなく綺麗に安定します。" },
    ru: { name: "Мочка (Lobe)", healing: "4 ~ 6 недель", pain: 1, desc: "Самый классический прокол с минимальным уровнем боли. Идеален для новичков. Отлично подходит для ношения украшений любого размера и формы. Популярен среди всех возрастов.", tip: "После душа обязательно просушивайте прокол прохладным воздухом фена, чтобы избежать воспалений." },
    ar: { name: "شحمة الأذن (Lobe)", healing: "4 ~ 6 أسابيع", pain: 1, desc: "الموضع الأساسي والأقل ألماً على الإطلاق. يوصى به بشدة للمبتدئين في الثقب. ممتاز لتنسيق مختلف أحجام وأشكال الأقراط. محبوب من جميع الفئات والأعمار.", tip: "جفف المنطقة بهواء مجفف الشعر البارد بعد الاستحمام لمنع حدوث أي التهابات." },
    zh: { name: "耳垂 (Lobe)", healing: "4 ~ 6周", pain: 1, desc: "最基础、痛感最低的部位。非常适合初次穿刺的新手。可搭配各种尺寸与形状的耳饰，是不分男女老少最受欢迎的经典部位。", tip: "洗脸或淋浴后，请用吹风机冷风档吹干，保持清爽有助于伤口完美愈合。" }
  },
  helix: {
    ko: { name: "귓바퀴", healing: "2 ~ 3개월", pain: 2, desc: "귀 외곽 라인을 따라 연출하여 정면에서도 가장 눈에 잘 띄는 매력적인 부위입니다. 링 피어싱이나 트위스터, 큐빅 바벨 등 다채로운 주얼리 레이어드가 가능해 귀테리어의 핵심이 됩니다.", tip: "머리카락이나 옷을 입고 벗을 때 걸리기 쉬우니 시술 초기에는 특히 주의해 주셔야 합니다." },
    en: { name: "Helix", healing: "2 ~ 3 months", pain: 2, desc: "Positioned along the outer cartilage rim, making it highly visible and attractive from the front. Perfect for layering rings, twist barbells, or studs. The core of any ear curation.", tip: "It easily catches on hair or clothes. Be extremely careful when dressing or brushing your hair in the beginning." },
    ja: { name: "ヘリックス (Helix)", healing: "2 〜 3ヶ月", pain: 2, desc: "耳の外側の軟骨のふちに沿って開けるため、正面から見ても最も目立つ魅力的な部位です。フープピアスやスパイラル、バー벨など多彩なコーディネートが可能で、イヤーデコレーションの中心となります。", tip: "髪の毛や衣服の着脱時に引っかかりやすいため、施術初期は特に注意が必要です。" },
    ru: { name: "Хеликс (Helix)", healing: "2 ~ 3 месяца", pain: 2, desc: "Прокол по внешнему краю хряща, который отлично виден спереди. Позволяет сочетать кольца, циркуляры и лабреты, являясь основой красивого проекта ушной раковины.", tip: "Легко цепляется за волосы и одежду при переодевании. Будьте предельно аккуратны в первое время." },
    ar: { name: "غضروف الأذن الخارجي (Helix)", healing: "2 ~ 3 أشهر", pain: 2, desc: "ثقب على طول الحافة الغضروفية الخارجية للأذن، مما يجعله واضحاً وجذاباً من الأمام. مثالي لتنسيق الحلقات الدائرية واللوالب والقطع المرصعة، وهو أساس أي تنسيق للأذن.", tip: "قد يعلق بالشعر أو الملابس بسهولة أثناء ارتدائها أو خلعها، لذا يرجى الحذر الشديد في البداية." },
    zh: { name: "耳轮 (Helix)", healing: "2 ~ 3个月", pain: 2, desc: "沿着耳廓外侧轮廓穿刺，正面视觉效果极佳。可搭配环形、扭转形或各类闪亮耳钉，是耳饰组合搭配（耳饰墙）的核心亮点部位。", tip: "极易被头发、衣服穿脱或梳头时挂蹭，穿刺初期需要格外小心防护。" }
  },
  industrial: {
    ko: { name: "사선 피어싱", healing: "3 ~ 4개월", pain: 4, desc: "귀 위쪽 두 군데의 구멍을 하나의 긴 바벨로 연결하는 유니크하고 압도적인 존재감의 시술입니다. 힙하고 스트릿한 무드를 극대화해주며 남들과 다른 독보적인 스타일을 원할 때 제격입니다.", tip: "두 구멍의 각도와 위치 선정이 완벽해야 귀 모양이 변형되지 않으므로 미니스 구월점의 전문적인 맞춤 시술이 필수입니다." },
    en: { name: "Industrial", healing: "3 ~ 4 months", pain: 4, desc: "A unique, bold procedure connecting two separate cartilage piercings with a single straight barbell. It maximizes street-style aesthetic and is perfect for expressing a distinct, rebellious vibe.", tip: "The angles and placement of both holes must align perfectly to prevent ear shape distortion. Professional curation at Minis Guwol is essential." },
    ja: { name: "인더스트리얼 (Industrial)", healing: "3 〜 4ヶ月", pain: 4, desc: "耳の上部2箇所の軟骨に穴を開け、1本の長いストレートバーベルでつなぐ、圧倒的な存在感を放つ施術です。ストリート感のあるクールな雰囲気を極限まで高めてくれます。", tip: "2つの穴の角度と位置が完璧に揃っていないと耳の変形の原因になるため、ミニス九月店のプロによる正確な施術が不可欠です。" },
    ru: { name: "Индастриал (Industrial)", healing: "3 ~ 4 месяца", pain: 4, desc: "Уникальный прокол, соединяющий два отверстия в хряще одной длинной прямой штангой. Придает образу дерзкий уличный стиль и подходит тем, кто ищет максимальное самовыражение.", tip: "Углы и расположение отверстий должны идеально совпадать, чтобы хрящ не деформировался. Доверяйте этот прокол только профессионалам Minis." },
    ar: { name: "الثقب الصناعي (Industrial)", healing: "3 ~ 4 أشهر", pain: 4, desc: "ثقب فريد وجريء يربط بين ثقبين منفصلين في الغضروف العلوي بواسطة قضيب معدني طويل مستقيم. يمنحك مظهراً عصرياً وجريئاً ومثالي للتعبير عن أسلوب متمرد ومميز.", tip: "يجب محاذاة زوايا الثقبين بدقة متناهية لمنع تشوه شكل الأذن. خبرة صالون مينيس غوول تضمن لك ذلك." },
    zh: { name: "工业脚手架 (Industrial)", healing: "3 ~ 4个月", pain: 4, desc: "用一根直长双头杠铃横跨并连接耳轮上方的两个对穿孔，视觉冲击力极强。能极大彰显街头风与个性，是追求独特张扬风格的最佳选择。", tip: "两个穿孔的角度和间距必须精准对称以防耳骨受力变形，此项目必须由Minis九月店专业技师精细操作。" }
  },
  conch: {
    ko: { name: "이너컨츠", healing: "2 ~ 3개월", pain: 3, desc: "귀 안쪽의 넓은 연골 부위로, 정면에서 보았을 때 입체감 있게 반짝여서 인기가 매우 높습니다. 붓기가 가라앉은 후 큰 링이나 볼륨감 있는 주얼리로 교체하면 한층 더 화려한 귀테리어가 완성됩니다.", tip: "안쪽에 위치해 있어 비교적 머리카락이나 옷에 덜 걸리는 장점이 있어 관리가 비교적 수월한 편입니다." },
    en: { name: "Inner Conch", healing: "2 ~ 3 months", pain: 3, desc: "Located in the center cup of the ear. It stands out beautifully with high dimensional sparkle from the front. Swapping to a large hoop or bold ring after healing creates a gorgeous look.", tip: "Since it is tucked inside the ear, it catches less on hair and clothes, making it relatively easier to heal and maintain." },
    ja: { name: "インナーコンク (Inner Conch)", healing: "2 〜 3ヶ月", pain: 3, desc: "耳の中央のくぼんだ軟骨部分で、正面から見たときに立体的にキラキラと輝くため、非常に人気があります。完成後に大きなリングやボリュームのあるジュエルに交換すると、より華やかになります。", tip: "耳の内側奥に位置しているため、髪や服に引っかかりにくく、比較的ケアしやすいメリットがあります。" },
    ru: { name: "Конч (Inner Conch)", healing: "2 ~ 3 месяца", pain: 3, desc: "Прокол в центральной чаше ушной раковины. Смотрится очень эффектно и объемно при взгляде спереди. Замена на широкое кольцо после заживления делает образ невероятно роскошным.", tip: "Поскольку прокол расположен внутри ушной раковины, он меньше подвержен трению об одежду и волосы, что облегчает заживление." },
    ar: { name: "غضروف الأذن الداخلي (Inner Conch)", healing: "2 ~ 3 أشهر", pain: 3, desc: "يقع في التجويف الأوسط للأذن. يبرز بشكل جميل ومجسم من الأمام. استبدال القطعة بحلقة كبيرة أو قطعة بارزة بعد الشفاء يمنحك مظهراً رائعاً للغاية.", tip: "بما أنه يقع في تجويف الأذن الداخلي، فهو أقل عرضة للاحتكاك بالشعر أو الملابس، مما يجعل العناية به أسهل." },
    zh: { name: "内耳廓 (Inner Conch)", healing: "2 ~ 3个月", pain: 3, desc: "位于耳朵中部的内凹软骨盆地。正面佩戴具有强烈的立体闪耀感，备受欢迎。消肿恢复后可更换为环形圈或大闪钻，打造高级华丽风格。", tip: "由于深处耳朵内侧陷落处，被头发或衣服意外挂碰的几率较低，日常打理和恢复相对轻松。" }
  },
  tragus: {
    ko: { name: "트라거스", healing: "2 ~ 3개월", pain: 3, desc: "귓구멍 바로 앞쪽의 작은 연골 부위로, 귀 안쪽과 얼굴형을 동시에 밝혀주는 작지만 확실한 포인트입니다. 주로 심플한 라블렛(뒷면이 납작한 피어싱)을 사용하여 깔끔한 데일리 세팅을 추천합니다.", tip: "시술 초기에는 이어폰(에어팟 등) 사용을 자제하고 라블렛 피어싱을 착용하는 것이 빠른 회복에 큰 도움이 됩니다." },
    en: { name: "Tragus", healing: "2 ~ 3 months", pain: 3, desc: "The small flap of cartilage directly in front of the ear canal. A subtle yet distinct point that brightens up both your ear curation and facial features. We recommend flat-back labrets for comfort.", tip: "Avoid using in-ear headphones (AirPods, etc.) during the early healing phase and wear flat-back labrets to prevent friction." },
    ja: { name: "トラガス (Tragus)", healing: "2 〜 3ヶ月", pain: 3, desc: "耳穴の真前にある小さな三角形の軟骨で、耳の内側とお顔立ちを同時に明るく引き立てるポイントです。裏側が平らなラブレットスタッドを使用し、すっきりとした日常使いの設定をおすすめします。", tip: "完成するまでは、イヤホン（AirPodsなど）の使用を控え、ラブレットピアスを着用することが順調な回復に繋がります。" },
    ru: { name: "Трагус (Tragus)", healing: "2 ~ 3 месяца", pain: 3, desc: "Прокол небольшого хрящевого выступа прямо перед слуховым проходом. Маленький, но выразительный акцент, освежающий черты лица. Рекомендуется носить лабреты с плоской обратной стороной.", tip: "В первые недели заживления откажитесь от использования внутриканальных наушников (AirPods) и носите лабреты для минимизации трения." },
    ar: { name: "وتد الأذن (Tragus)", healing: "2 ~ 3 أشهر", pain: 3, desc: "الغضروف الصغير البارز مباشرة أمام فتحة الأذن. نقطة ناعمة وواضحة تضيء تنسيق الأذن وملامح الوجه معاً. نوصي بارتداء أقراط مسطحة الخلفية (Labret) لمزيد من الراحة.", tip: "تجنب استخدام سماعات الأذن الداخلية (AirPods وغيرها) خلال المراحل الأولى من الشفاء وارتد أقراطاً مسطحة الخلفية لتجنب الاحتكاك." },
    zh: { name: "耳屏 (Tragus)", healing: "2 ~ 3个月", pain: 3, desc: "外耳道正前方的软骨小凸起。能同时点亮耳朵内侧和面部线条，是精巧别致的点睛之笔。通常建议选用背面扁平的平底耳钉（Labret）以确保舒适。", tip: "穿刺初期需暂停使用入耳式耳机（如AirPods），佩戴平底耳钉可极大避免摩擦，有利于快速消肿。" }
  },
  rook: {
    ko: { name: "룩", healing: "3 ~ 4개월", pain: 4, desc: "귀 안쪽 윗부분의 접힌 연골을 세로로 관통하는 난이도 높은 시술입니다. 미니 바나나 바벨이나 링 주얼리를 이용해 디테일하고 정교한 스타일링을 할 수 있어 매니아가 많은 세련된 부위입니다.", tip: "접혀 있는 좁은 틈새에 위치하므로 염증 예방을 위해 손으로 만지지 않는 것이 가장 중요합니다." },
    en: { name: "Rook", healing: "3 ~ 4 months", pain: 4, desc: "A vertical cartilage piercing placed in the upper inner ear's fold. It allows for delicate and intricate styling with curved barbells or small rings, making it a favorite for piercing enthusiasts.", tip: "Located in a tight, folded gap. The absolute most important rule is not to touch or pick at it to prevent irritation and infection." },
    ja: { name: "ルック (Rook)", healing: "3 〜 4ヶ月", pain: 4, desc: "耳の内側上部にある折り重なった軟骨を垂直に貫通する、難易度の高い施術です。ミニバナナバーベルや小さなリングを使用して、繊細でエッジの効いたコーディネートが楽しめます。", tip: "軟骨の狭い隙間に位置しているため、炎症を防ぐために手で触らないよう徹底することが重要です。" },
    ru: { name: "Рук (Rook)", healing: "3 ~ 4 месяца", pain: 4, desc: "Вертикальный прокол складки хряща в верхней внутренней части уха. Позволяет создавать изящные акценты с помощью изогнутых штанг (бананов) или колечек. Любим ценителями необычного пирсинга.", tip: "Находится в узкой складке ушной раковины. Главное правило — не трогать прокол руками для предотвращения воспалений." },
    ar: { name: "الروك (Rook)", healing: "3 ~ 4 أشهر", pain: 4, desc: "ثقب عمودي صعب يمر عبر طية الغضروف الداخلي العلوي للأذن. يتيح تنسيقاً ناعماً ودقيقاً باستخدام قضبان منحنية (Barbell) أو حلقات صغيرة، مما يجعله مفضلاً لعشاق الثقوب المميزة.", tip: "بسبب موقعه الضيق في طيات الأذن، فإن القاعدة الأكثر أهمية هي عدم لمسه أو العبث به باليد لمنع التهيج والعدوى." },
    zh: { name: "洛克 (Rook)", healing: "3 ~ 4个月", pain: 4, desc: "垂直穿过耳朵内侧上部折叠状软骨隆起的高难度项目。可选用精细的弧形弯针（Banana Barbell）或小细圈，充满精致的几何感，深受穿刺发烧友追捧。", tip: "因地处折叠紧凑的缝隙，日常护理最忌讳用手指去抠弄或频繁调整，避免诱发严重的耳骨炎。" }
  },
  outconch: {
    ko: { name: "아웃컨츠 / 플랫", healing: "2 ~ 3개월", pain: 3, desc: "귀 위쪽 넓고 평평한 연골 부위(플랫)로, 화려하고 큰 팬던트나 멀티 스톤 주얼리를 세팅하기 가장 좋은 캔버스 같은 공간입니다. 넓은 면적 덕분에 다채로운 디자인 연출이 가능합니다.", tip: "안경 다리나 마스크 끈에 닿아 자극을 받기 쉬우므로 쓸리지 않도록 섬세한 주의가 요구됩니다." },
    en: { name: "Outer Conch / Flat", healing: "2 ~ 3 months", pain: 3, desc: "The flat cartilage space in the upper ear. Like a canvas, it's the perfect spot for showcase jewelry, large pendants, or clustered studs. Offers maximum styling versatility.", tip: "It is highly susceptible to rubbing against glasses arms, hairpins, or face mask loops. Pay close attention to keep it friction-free." },
    ja: { name: "アウターコンク (Outer Conch / Flat)", healing: "2 〜 3ヶ月", pain: 3, desc: "耳の上部にある平らな軟骨部分（フラット）で、華やかで大ぶりなチャームやマルチストーンを飾るのに最適なキャンバスのようなスペースです。広い面積のおかげで、個性的な表現が可能です。", tip: "メガネのつるやマスクの紐が当たりやすく刺激を受けやすいため、擦れないように細心の注意を払う必要があります。" },
    ru: { name: "Флэт / Аутконч (Outer Conch / Flat)", healing: "2 ~ 3 месяца", pain: 3, desc: "Широкая плоская часть хряща в верхней половине уха. Отличное полотно для крупных акцентных украшений, кластеров и ярких накруток с россыпью кристаллов.", tip: "Часто травмируется дужками очков, масками или при расчесывании. Будьте аккуратны, чтобы избежать постоянного трения." },
    ar: { name: "غضروف الأذن المسطح (Outer Conch / Flat)", healing: "2 ~ 3 أشهر", pain: 3, desc: "المساحة الغضروفية المسطحة في الجزء العلوي من الأذن. مثل اللوحة الفنية، فهو المكان المثالي لعرض المجوهرات المميزة أو الفصوص الكبيرة. يمنحك أقصى درجات التنوع في التنسيق.", tip: "عرضة للاحتكاك الشديد بذراع النظارة أو خيوط الكمامة. يرجى الانتباه والحرص لتقليل الاحتكاк قدر الإمكان." },
    zh: { name: "外耳廓 / 平坦区 (Outer Conch / Flat)", healing: "2 ~ 3个月", pain: 3, desc: "耳朵上方开阔平坦的软骨区（Flat）。如画布一般，最适合佩戴显眼的大吊坠、组合排钻饰品或设计复杂的耳钉。具有极强的可塑性与搭配空间。", tip: "极易摩擦到眼镜腿、发夹或口罩挂绳。日常佩戴这些物品时，需要格外轻缓，防止反复拉扯拉伤伤口。" }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const header = document.querySelector("header");
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const galleryGrid = document.getElementById("gallery-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCloseBtn = document.querySelector(".modal-close-btn");
  
  // Lang Selector Elements
  const langSelect = document.getElementById("lang-select");

  // Interactive Ear Map Elements
  const piercingPoints = document.querySelectorAll(".piercing-point");
  const earKr = document.querySelector(".ear-info-kr");
  const earEn = document.querySelector(".ear-info-en");
  const statHealing = document.getElementById("stat-healing");
  const statPain = document.getElementById("stat-pain");
  const earDesc = document.querySelector(".ear-info-desc");
  const earTip = document.getElementById("ear-tip-text");
  
  // State variables
  let currentLanguage = "ko";
  let activeEarPlacement = "helix";

  // 1. Scroll Header Effect & Active Link Highlight
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    
    let current = "";
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // 2. Mobile Navbar Toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // 3. Instagram Gallery Categorization & Render
  function getCategory(post) {
    if (post.category) return post.category;
    const desc = typeof post.description === "string" ? post.description : (post.description["ko"] || "");
    const text = desc.toLowerCase();
    const earKeywords = ["귀", "귓바퀴", "사선", "이너컨츠", "아웃컨츠", "룩", "귓불", "인더스트리얼", "헬릭스", "트라거스", "귀테리어", "helix", "conch", "tragus", "industrial"];
    const faceKeywords = ["입술", "립", "눈밑", "페이스", "더멀", "코", "셉텀", "메두사", "애슐리", "혀", "dermal", "septum", "lip", "face", "tongue"];
    const bodyKeywords = ["배꼽", "바디", "navel", "body"];
    
    const hasEar = earKeywords.some(keyword => text.includes(keyword));
    const hasFace = faceKeywords.some(keyword => text.includes(keyword));
    const hasBody = bodyKeywords.some(keyword => text.includes(keyword));

    if (hasBody) return "body";
    if (hasFace) return "face";
    if (hasEar) return "ear";
    return "ear"; // Default category
  }

  function renderGallery(filter = "all") {
    galleryGrid.innerHTML = "";
    
    const filtered = INSTAGRAM_POSTS.filter(post => {
      if (filter === "all") return true;
      return getCategory(post) === filter;
    });

    if (filtered.length === 0) {
      const emptyText = currentLanguage === "ko" ? "등록된 사진이 없습니다." : 
                        currentLanguage === "en" ? "No photos registered." :
                        currentLanguage === "ja" ? "登録された写真はありません。" :
                        currentLanguage === "ru" ? "Фотографии отсутствуют." :
                        currentLanguage === "ar" ? "لا توجد صور مسجلة." : "暂无照片。";
      galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">${emptyText}</div>`;
      return;
    }

    filtered.forEach(post => {
      const category = getCategory(post);
      const card = document.createElement("div");
      card.className = "gallery-item";
      card.setAttribute("data-id", post.id);
      card.setAttribute("data-category", category);

      const viewText = TRANSLATIONS[currentLanguage]?.gallery_view_more || "자세히 보기";
      const activeDesc = typeof post.description === "string" ? post.description : (post.description[currentLanguage] || post.description["ko"] || "");

      card.innerHTML = `
        <div class="gallery-img-wrapper">
          <picture>
            <source media="(max-width: 768px)" srcset="${post.image_mobile || post.image}">
            <img src="${post.image}" alt="Minis Piercing Post" loading="lazy" decoding="async">
          </picture>
        </div>
        <div class="gallery-overlay">
          <p class="gallery-desc-preview">${activeDesc}</p>
          <div class="gallery-instagram-icon">
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span>${viewText}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => openModal(post));
      galleryGrid.appendChild(card);
    });

    // Update mobile swiper after rendering
    updateMobileSwiper();
  }

  // ---- Mobile Swiper Logic ----
  const swiperPrev = document.getElementById("swiper-prev");
  const swiperNext = document.getElementById("swiper-next");
  const swiperCounter = document.getElementById("swiper-counter");
  const swiperTotal = document.getElementById("swiper-total");
  const swiperDots = document.getElementById("swiper-dots");

  let swiperCurrentIndex = 0;
  let swiperItemCount = 0;

  function isMobileView() {
    return window.innerWidth <= 768;
  }

  function getVisibleItems() {
    return galleryGrid.querySelectorAll(".gallery-item");
  }

  function updateSwiperUI() {
    if (!isMobileView()) return;
    const items = getVisibleItems();
    swiperItemCount = items.length;
    if (swiperItemCount === 0) return;

    // Clamp index
    if (swiperCurrentIndex >= swiperItemCount) swiperCurrentIndex = swiperItemCount - 1;
    if (swiperCurrentIndex < 0) swiperCurrentIndex = 0;

    // Update counter
    swiperCounter.querySelector(".current").textContent = swiperCurrentIndex + 1;
    swiperTotal.textContent = swiperItemCount;

    // Update arrow states
    swiperPrev.disabled = swiperCurrentIndex === 0;
    swiperNext.disabled = swiperCurrentIndex === swiperItemCount - 1;

    // Update dots
    swiperDots.innerHTML = "";
    // Show dots only if ≤ 30 items, otherwise just use counter
    if (swiperItemCount <= 30) {
      items.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "gallery-swiper-dot" + (i === swiperCurrentIndex ? " active" : "");
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => scrollToIndex(i));
        swiperDots.appendChild(dot);
      });
    }
  }

  function scrollToIndex(index) {
    const items = getVisibleItems();
    if (index < 0 || index >= items.length) return;
    swiperCurrentIndex = index;
    items[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    updateSwiperUI();
  }

  function updateMobileSwiper() {
    swiperCurrentIndex = 0;
    if (isMobileView()) {
      galleryGrid.scrollLeft = 0;
    }
    updateSwiperUI();
  }

  // Scroll-based index detection
  let swiperScrollTimeout;
  galleryGrid.addEventListener("scroll", () => {
    if (!isMobileView()) return;
    clearTimeout(swiperScrollTimeout);
    swiperScrollTimeout = setTimeout(() => {
      const items = getVisibleItems();
      if (items.length === 0) return;
      const containerRect = galleryGrid.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      let closestIndex = 0;
      let closestDist = Infinity;
      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const dist = Math.abs(itemCenter - containerCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      swiperCurrentIndex = closestIndex;
      updateSwiperUI();
    }, 60);
  }, { passive: true });

  // Arrow buttons
  swiperPrev.addEventListener("click", () => scrollToIndex(swiperCurrentIndex - 1));
  swiperNext.addEventListener("click", () => scrollToIndex(swiperCurrentIndex + 1));

  // Recalculate on resize
  window.addEventListener("resize", () => {
    updateSwiperUI();
  });
  // ---- End Mobile Swiper Logic ----

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filter = btn.getAttribute("data-filter");
      renderGallery(filter);
    });
  });

  // 4. Modal Control Logic
  function openModal(post) {
    const modalImg = document.getElementById("modal-img");
    const modalDesc = document.getElementById("modal-desc");
    const modalInstaLink = document.getElementById("modal-insta-link");

    modalImg.src = post.image;
    modalImg.alt = "Minis Piercing Review Work";
    
    // Dynamic Hashtag Highlighting
    const activeDesc = typeof post.description === "string" ? post.description : (post.description[currentLanguage] || post.description["ko"] || "");
    const descText = activeDesc.replace(/#\S+/g, match => {
      return `<span style="color: var(--accent-pink); font-weight: 500;">${match}</span>`;
    });
    modalDesc.innerHTML = descText;
    
    modalInstaLink.href = post.link;

    modalOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.style.display = "none";
    document.body.style.overflow = "";
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.style.display === "flex") {
      closeModal();
    }
  });

  // 5. Interactive Ear Map Placement Click Handler
  function updateEarInfo(placementKey) {
    activeEarPlacement = placementKey;
    const placementData = PIERCING_INFO[placementKey];
    if (!placementData) return;

    // Get current language data or fallback to English/Korean
    const data = placementData[currentLanguage] || placementData["ko"];

    // Remove active class from all points
    piercingPoints.forEach(pt => pt.classList.remove("active"));
    
    // Add active class to corresponding SVG node
    const activePoint = document.querySelector(`.piercing-point[data-piercing="${placementKey}"]`);
    if (activePoint) activePoint.classList.add("active");

    // Update panel texts
    earKr.textContent = data.name;
    earEn.textContent = placementKey.charAt(0).toUpperCase() + placementKey.slice(1);
    statHealing.textContent = data.healing;
    
    // Pain level star rendering
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < placementData["ko"].pain) {
        stars += "★";
      } else {
        stars += "☆";
      }
    }
    const painLabelText = currentLanguage === "ko" ? "지수" :
                          currentLanguage === "ja" ? "レベル" :
                          currentLanguage === "ru" ? "уровень" :
                          currentLanguage === "ar" ? "مستوى" :
                          currentLanguage === "zh" ? "指数" : "level";
    statPain.textContent = `${stars} (${painLabelText} ${placementData["ko"].pain}/5)`;
    
    earDesc.textContent = data.desc;
    earTip.textContent = data.tip;
  }

  piercingPoints.forEach(point => {
    point.addEventListener("click", () => {
      const placement = point.getAttribute("data-piercing");
      updateEarInfo(placement);
    });
  });

  // 6. Multilingual Translation System
  function detectLanguage() {
    const saved = localStorage.getItem("minis_lang");
    if (saved) return saved;

    const browserLang = (navigator.language || navigator.userLanguage || "ko").toLowerCase();
    if (browserLang.startsWith("ja")) return "ja";
    if (browserLang.startsWith("ru")) return "ru";
    if (browserLang.startsWith("ar")) return "ar";
    if (browserLang.startsWith("zh")) return "zh";
    if (browserLang.startsWith("en")) return "en";
    return "ko";
  }

  function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("minis_lang", lang);
    document.documentElement.lang = lang;
    
    if (langSelect) langSelect.value = lang;

    // Apply translations
    document.querySelectorAll("[data-i18n]").forEach(elem => {
      const key = elem.getAttribute("data-i18n");
      const translation = TRANSLATIONS[lang]?.[key];
      if (translation) {
        elem.innerHTML = translation;
      }
    });

    // Check direction (RTL for Arabic)
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
      document.body.classList.add("rtl-mode");
    } else {
      document.documentElement.dir = "ltr";
      document.body.classList.remove("rtl-mode");
    }

    // Refresh components
    updateEarInfo(activeEarPlacement);
    
    // Remember current active filter and redraw gallery
    const activeFilterBtn = document.querySelector(".filter-btn.active");
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute("data-filter") : "all";
    renderGallery(activeFilter);
  }

  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  }

  // Initialize Language
  const initialLang = detectLanguage();
  setLanguage(initialLang);

  // 7. Floating BGM Player Controller
  const bgmAudio = document.getElementById("bgm-audio");
  const bgmToggleBtn = document.getElementById("bgm-toggle-btn");

  if (bgmAudio && bgmToggleBtn) {
    const bgmPref = localStorage.getItem("minis_bgm_play") === "true";

    bgmToggleBtn.addEventListener("click", () => {
      if (bgmAudio.paused) {
        bgmAudio.play()
          .then(() => {
            bgmToggleBtn.classList.add("playing");
            localStorage.setItem("minis_bgm_play", "true");
          })
          .catch(err => {
            console.log("Audio play failed: ", err);
          });
      } else {
        bgmAudio.pause();
        bgmToggleBtn.classList.remove("playing");
        localStorage.setItem("minis_bgm_play", "false");
      }
    });

    if (bgmPref) {
      const playOnInteraction = () => {
        bgmAudio.play().then(() => {
          bgmToggleBtn.classList.add("playing");
          window.removeEventListener("click", playOnInteraction);
          window.removeEventListener("touchstart", playOnInteraction);
        }).catch(() => {});
      };
      window.addEventListener("click", playOnInteraction);
      window.addEventListener("touchstart", playOnInteraction);
    }
  }
});

// Instagram DM copy template and redirect automation
window.handleInstaDMClick = function() {
  const template = `[미니스 피어싱 구월점 예약 문의]
- 성함: 
- 연락처: 
- 예약 희망 일시: 
- 시술/세팅 부위: 
- 참고 사진 첨부 여부: `;

  const langSelect = document.getElementById("lang-select");
  const lang = langSelect ? langSelect.value : "ko";
  
  let msg = "📋 예약 양식이 복사되었습니다! DM 창에 붙여넣어(꾹 누르기/붙여넣기) 문의해 주세요.";
  if (lang === "en") msg = "📋 Reservation template copied! Please paste it in the DM window to inquire.";
  else if (lang === "ja") msg = "📋 予約フォームがコピーされました！DM画面に貼り付けて（長押し/貼り付け）お問い合わせください。";
  else if (lang === "ru") msg = "📋 Шаблон бронирования скопирован! Пожалуйста, вставьте его в окно DM для запроса.";
  else if (lang === "ar") msg = "📋 تم نسخ نموذج الحجز! يرجى لصقه في نافذة رسائل DM للاستفسار.";
  else if (lang === "zh") msg = "📋 预约模板已复制！请粘贴到私信（DM）窗口中发送以进行咨询。";

  // Copy to clipboard
  navigator.clipboard.writeText(template).then(() => {
    // Show premium toast alert
    window.showToast(msg);
    
    // Redirect to Instagram DM (ig.me opens direct message in Instagram app)
    setTimeout(() => {
      window.open("https://ig.me/m/guwall.minis", "_blank");
    }, 2000);
  }).catch(err => {
    // Fallback if clipboard copy fails
    window.open("https://ig.me/m/guwall.minis", "_blank");
  });
};

// Premium Toast Notification helper
window.showToast = function(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "toast-notification";
    toast.innerHTML = `<span class="toast-icon"><i class="fa-solid fa-circle-check"></i></span><span class="toast-text"></span>`;
    document.body.appendChild(toast);
  }
  
  toast.querySelector(".toast-text").textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
};
