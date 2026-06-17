// JavaScript Logic for Minis Piercing Guwol Homepage

// Ear Piercing Placement Information Database
const PIERCING_INFO = {
  lobe: {
    kr: "귓볼",
    en: "Lobe",
    healing: "4 ~ 6주",
    pain: 1,
    desc: "가장 기본적이고 통증이 가장 적은 부위입니다. 피어싱 입문자에게 강력히 추천하며, 다양한 크기와 형태의 귀걸이나 피어싱을 연출하기 좋습니다. 남녀노소 불문하고 가장 사랑받는 부위입니다.",
    tip: "시술 후 씻을 때 물기가 남지 않게 드라이어(찬바람)로 잘 말려주시면 덧나지 않고 예쁘게 아뭅니다."
  },
  helix: {
    kr: "귓바퀴",
    en: "Helix",
    healing: "2 ~ 3개월",
    pain: 2,
    desc: "귀 외곽 라인을 따라 연출하여 정면에서도 가장 눈에 잘 띄는 매력적인 부위입니다. 링 피어싱이나 트위스터, 큐빅 바벨 등 다채로운 주얼리 레이어드가 가능해 귀테리어의 핵심이 됩니다.",
    tip: "머리카락이나 옷을 입고 벗을 때 걸리기 쉬우니 시술 초기에는 특히 주의해 주셔야 합니다."
  },
  industrial: {
    kr: "사선 피어싱",
    en: "Industrial",
    healing: "3 ~ 4개월",
    pain: 4,
    desc: "귀 위쪽 두 군데의 구멍을 하나의 긴 바벨로 연결하는 유니크하고 압도적인 존재감의 시술입니다. 힙하고 스트릿한 무드를 극대화해주며 남들과 다른 독보적인 스타일을 원할 때 제격입니다.",
    tip: "두 구멍의 각도와 위치 선정이 완벽해야 귀 모양이 변형되지 않으므로 미니스 구월점의 전문적인 맞춤 시술이 필수입니다."
  },
  conch: {
    kr: "이너컨츠",
    en: "Inner Conch",
    healing: "2 ~ 3개월",
    pain: 3,
    desc: "귀 안쪽의 넓은 연골 부위로, 정면에서 보았을 때 입체감 있게 반짝여서 인기가 매우 높습니다. 붓기가 가라앉은 후 큰 링이나 볼륨감 있는 주얼리로 교체하면 한층 더 화려한 귀테리어가 완성됩니다.",
    tip: "안쪽에 위치해 있어 비교적 머리카락이나 옷에 덜 걸리는 장점이 있어 관리가 비교적 수월한 편입니다."
  },
  tragus: {
    kr: "트라거스",
    en: "Tragus",
    healing: "2 ~ 3개월",
    pain: 3,
    desc: "귓구멍 바로 앞쪽의 작은 연골 부위로, 귀 안쪽과 얼굴형을 동시에 밝혀주는 작지만 확실한 포인트입니다. 주로 심플한 라블렛(뒷면이 납작한 피어싱)을 사용하여 깔끔한 데일리 세팅을 추천합니다.",
    tip: "시술 초기에는 이어폰(에어팟 등) 사용을 자제하고 라블렛 피어싱을 착용하는 것이 빠른 회복에 큰 도움이 됩니다."
  },
  rook: {
    kr: "룩",
    en: "Rook",
    healing: "3 ~ 4개월",
    pain: 4,
    desc: "귀 안쪽 윗부분의 접힌 연골을 세로로 관통하는 난이도 높은 시술입니다. 미니 바나나 바벨이나 링 주얼리를 이용해 디테일하고 정교한 스타일링을 할 수 있어 매니아가 많은 세련된 부위입니다.",
    tip: "접혀 있는 좁은 틈새에 위치하므로 염증 예방을 위해 손으로 만지지 않는 것이 가장 중요합니다."
  },
  outconch: {
    kr: "아웃컨츠 / 플랫",
    en: "Outer Conch / Flat",
    healing: "2 ~ 3개월",
    pain: 3,
    desc: "귀 위쪽 넓고 평평한 연골 부위(플랫)로, 화려하고 큰 팬던트나 멀티 스톤 주얼리를 세팅하기 가장 좋은 캔버스 같은 공간입니다. 넓은 면적 덕분에 다채로운 디자인 연출이 가능합니다.",
    tip: "안경 다리나 마스크 끈에 닿아 자극을 받기 쉬우므로 쓸리지 않도록 섬세한 주의가 요구됩니다."
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
  const modalContainer = document.querySelector(".modal-container");
  const modalCloseBtn = document.querySelector(".modal-close-btn");
  
  // Interactive Ear Map Elements
  const piercingPoints = document.querySelectorAll(".piercing-point");
  const earKr = document.querySelector(".ear-info-kr");
  const earEn = document.querySelector(".ear-info-en");
  const statHealing = document.getElementById("stat-healing");
  const statPain = document.getElementById("stat-pain");
  const earDesc = document.querySelector(".ear-info-desc");
  const earTip = document.getElementById("ear-tip-text");

  // 1. Scroll Header Effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    
    // Active Navigation Link on Scroll
    let current = "";
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 150) {
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
  // Helper to categorize posts based on text hashtags
  function getCategory(desc) {
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

  // Render function
  function renderGallery(filter = "all") {
    galleryGrid.innerHTML = "";
    
    // INSTAGRAM_POSTS comes from global posts_data.js
    const filtered = INSTAGRAM_POSTS.filter(post => {
      if (filter === "all") return true;
      return getCategory(post.description) === filter;
    });

    if (filtered.length === 0) {
      galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">등록된 사진이 없습니다.</div>`;
      return;
    }

    filtered.forEach(post => {
      const category = getCategory(post.description);
      const card = document.createElement("div");
      card.className = "gallery-item";
      card.setAttribute("data-id", post.id);
      card.setAttribute("data-category", category);

      card.innerHTML = `
        <div class="gallery-img-wrapper">
          <img src="${post.image}" alt="Minis Piercing Post" loading="lazy">
        </div>
        <div class="gallery-overlay">
          <p class="gallery-desc-preview">${post.description}</p>
          <div class="gallery-instagram-icon">
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span>자세히 보기</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => openModal(post));
      galleryGrid.appendChild(card);
    });
  }

  // 4. Gallery Filter Click Handler
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filter = btn.getAttribute("data-filter");
      renderGallery(filter);
    });
  });

  // Initialize Gallery
  renderGallery();

  // 5. Modal Control Logic
  function openModal(post) {
    const modalImg = document.getElementById("modal-img");
    const modalDesc = document.getElementById("modal-desc");
    const modalInstaLink = document.getElementById("modal-insta-link");

    modalImg.src = post.image;
    modalImg.alt = "Minis Piercing Review Work";
    
    // Dynamic Hashtag Highlighting
    const descText = post.description.replace(/#\S+/g, match => {
      return `<span style="color: var(--accent-pink); font-weight: 500;">${match}</span>`;
    });
    modalDesc.innerHTML = descText;
    
    modalInstaLink.href = post.link;

    modalOverlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  function closeModal() {
    modalOverlay.style.display = "none";
    document.body.style.overflow = ""; // Restore scroll
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

  // 6. Interactive Ear Map Placement Click Handler
  function updateEarInfo(placementKey) {
    const data = PIERCING_INFO[placementKey];
    if (!data) return;

    // Remove active class from all points
    piercingPoints.forEach(pt => pt.classList.remove("active"));
    
    // Add active class to corresponding SVG node
    const activePoint = document.querySelector(`.piercing-point[data-piercing="${placementKey}"]`);
    if (activePoint) activePoint.classList.add("active");

    // Update panel texts
    earKr.textContent = data.kr;
    earEn.textContent = data.en;
    statHealing.textContent = data.healing;
    
    // Pain level star rendering
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < data.pain) {
        stars += "★";
      } else {
        stars += "☆";
      }
    }
    statPain.textContent = `${stars} (지수 ${data.pain}/5)`;
    
    earDesc.textContent = data.desc;
    earTip.textContent = data.tip;
  }

  piercingPoints.forEach(point => {
    point.addEventListener("click", () => {
      const placement = point.getAttribute("data-piercing");
      updateEarInfo(placement);
    });
  });

  // Initialize Ear Map Info with Helix
  updateEarInfo("helix");
});
