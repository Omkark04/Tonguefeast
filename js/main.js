/* ============================================================
   TONGUE FEAST — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Sticky Navigation ──
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ── Mobile Navigation ──
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.mobile-overlay');

  function toggleMobileNav() {
    hamburger?.classList.toggle('active');
    navLinks?.classList.toggle('open');
    overlay?.classList.toggle('active');
    document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', toggleMobileNav);
  overlay?.addEventListener('click', toggleMobileNav);

  // Close mobile nav on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  });

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll-Triggered Reveal Animations ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── Back to Top Button ──
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Active Navigation Link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Hero Product Carousel ──
  const carouselCards = document.querySelectorAll('.carousel-card');
  if (carouselCards.length > 0) {
    let currentIndex = 0;
    const total = carouselCards.length;
    const positions = ['pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];

    function updateCarousel() {
      carouselCards.forEach(card => {
        card.className = 'carousel-card';
      });
      for (let i = 0; i < positions.length; i++) {
        const offset = i - 2; // -2, -1, 0, 1, 2
        const cardIndex = (currentIndex + offset + total) % total;
        carouselCards[cardIndex].classList.add(positions[i]);
      }
    }

    updateCarousel();
    setInterval(() => {
      currentIndex = (currentIndex + 1) % total;
      updateCarousel();
    }, 3000);
  }

  // ── Trust Badges Auto-Scroll (Mobile) ──
  const trustBadges = document.querySelectorAll('.trust-badge');
  const trustDots = document.querySelectorAll('.trust-dot');
  if (trustBadges.length > 0 && trustDots.length > 0) {
    let trustIndex = 0;
    const totalBadges = trustBadges.length;
    const tbPositions = ['tb-far-left', 'tb-left', 'tb-center', 'tb-right', 'tb-far-right'];
    let trustInterval;

    function updateTrustCarousel() {
      trustBadges.forEach(b => {
        b.classList.remove(...tbPositions);
        b.style.transform = '';
      });
      for (let i = 0; i < tbPositions.length; i++) {
        const offset = i - 2;
        const badgeIdx = (trustIndex + offset + totalBadges) % totalBadges;
        trustBadges[badgeIdx].classList.add(tbPositions[i]);
      }
      trustDots.forEach(d => d.classList.remove('active'));
      if (trustDots[trustIndex]) trustDots[trustIndex].classList.add('active');
    }

    function startTrustScroll() {
      trustInterval = setInterval(() => {
        trustIndex = (trustIndex + 1) % totalBadges;
        updateTrustCarousel();
      }, 3000);
    }

    trustDots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(trustInterval);
        trustIndex = parseInt(dot.dataset.index);
        updateTrustCarousel();
        startTrustScroll();
      });
    });

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    function handleMobileChange(e) {
      if (e.matches) {
        updateTrustCarousel();
        startTrustScroll();
      } else {
        clearInterval(trustInterval);
        trustBadges.forEach(b => { b.classList.remove(...tbPositions); b.style.transform = ''; });
      }
    }
    mobileQuery.addEventListener('change', handleMobileChange);
    if (mobileQuery.matches) { updateTrustCarousel(); startTrustScroll(); }
  }

  // ── Product Search & Filter (Products Page) ──
  const sizeBtns = document.querySelectorAll('.filter-buttons .filter-btn');
  const typeBtns = document.querySelectorAll('.filter-row .filter-btn[data-type]');
  const catBtns = document.querySelectorAll('.filter-row .filter-btn[data-category]');
  const productCards = document.querySelectorAll('.products-grid .product-card');
  const searchInput = document.getElementById('productSearch');

  let activeSize = 'all';
  let activeType = null; // null means no type filter
  let activeCategory = 'all';

  function filterProducts() {
    const searchTerm = (searchInput?.value || '').toLowerCase().trim();

    productCards.forEach(card => {
      const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
      const sizes = card.dataset.sizes || '';
      const type = card.dataset.type || '';
      const categories = card.dataset.category || '';

      const matchesSearch = !searchTerm || title.includes(searchTerm);
      const matchesSize = activeSize === 'all' || sizes.includes(activeSize);
      const matchesType = !activeType || type === activeType;
      const matchesCat = activeCategory === 'all' || categories.includes(activeCategory);

      if (matchesSearch && matchesSize && matchesType && matchesCat) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Size filter buttons (exclusive)
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSize = btn.dataset.filter;
      filterProducts();
    });
  });

  // Type filter buttons (toggle)
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        activeType = null;
      } else {
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeType = btn.dataset.type;
      }
      filterProducts();
    });
  });

  // Category filter buttons (exclusive)
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      filterProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }


  // ── Bulk Inquiry WhatsApp ──
  document.querySelectorAll('.bulk-inquiry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const productName = card?.querySelector('.card-title')?.textContent || 'your product';
      const sizes = card?.querySelector('.card-sizes')?.textContent?.replace('Sizes:', '').trim() || '';
      let msg = `Hello! I am interested in placing a *bulk order* for *${productName}*`;
      if (sizes) msg += ` (Available: ${sizes})`;
      msg += `. Please share pricing and minimum order details.`;
      window.open(`https://wa.me/917263983233?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  // ── Contact Form Validation ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = contactForm.querySelectorAll('[required]');

      fields.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#C62828';
          valid = false;
        }
      });

      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.style.borderColor = '#C62828';
        valid = false;
      }

      const phoneField = contactForm.querySelector('input[type="tel"]');
      if (phoneField && phoneField.value && !/^[\d\s+\-()]{10,}$/.test(phoneField.value)) {
        phoneField.style.borderColor = '#C62828';
        valid = false;
      }

      if (valid) {
        // Gather form data
        const name = contactForm.querySelector('#name')?.value.trim() || '';
        const phone = contactForm.querySelector('#phone')?.value.trim() || '';
        const email = contactForm.querySelector('#email')?.value.trim() || '';
        const businessType = contactForm.querySelector('#businessType')?.value || '';
        const message = contactForm.querySelector('#message')?.value.trim() || '';

        // Compose WhatsApp message
        let waMessage = `🌶️ *New Inquiry from Tongue Feast Website*\n\n`;
        waMessage += `👤 *Name:* ${name}\n`;
        waMessage += `📞 *Phone:* ${phone}\n`;
        waMessage += `✉️ *Email:* ${email}\n`;
        if (businessType) {
          waMessage += `🏢 *Business Type:* ${businessType}\n`;
        }
        waMessage += `\n💬 *Message:*\n${message}`;

        // Open WhatsApp with pre-filled message
        const waPhone = '917263983233';
        const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, '_blank');

        // Show success message
        contactForm.style.display = 'none';
        const successMsg = document.querySelector('.form-success');
        if (successMsg) successMsg.classList.add('show');
      }
    });
  }

  // ── WhatsApp Link Generator ──
  const whatsappBtns = document.querySelectorAll('[data-whatsapp]');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = '917263983233'; // Replace with actual number
      const message = btn.dataset.whatsapp || 'Hello! I am interested in Tongue Feast products.';
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    });
  });

  // ── Counter Animation (About page stats) ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const increment = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 25);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // ── Blog expand/collapse (Blog page) ──
  document.querySelectorAll('.blog-read-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = btn.dataset.article;
      const detail = document.getElementById(articleId);
      if (detail) {
        const isVisible = detail.style.display === 'block';
        // Hide all
        document.querySelectorAll('.blog-detail-content').forEach(d => d.style.display = 'none');
        document.querySelectorAll('.blog-read-more').forEach(b => b.textContent = 'Read Article →');
        if (!isVisible) {
          detail.style.display = 'block';
          btn.textContent = 'Close Article ×';
          detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ── Customer Reviews Auto-Scroll (Mobile) ──
  const reviewsGrid = document.querySelector('.reviews-grid');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewDots = document.querySelectorAll('.review-dot');

  if (reviewsGrid && reviewCards.length > 0 && reviewDots.length > 0) {
    let reviewIndex = 0;
    let reviewInterval;

    const updateReviewDots = (index) => {
      reviewDots.forEach(d => d.classList.remove('active'));
      if (reviewDots[index]) reviewDots[index].classList.add('active');
    };

    const scrollReviews = (index) => {
      if (!reviewsGrid || !reviewCards[index]) return;
      const card = reviewCards[index];
      const scrollLeft = card.offsetLeft - reviewsGrid.offsetLeft - (reviewsGrid.clientWidth - card.clientWidth) / 2;
      reviewsGrid.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    };

    const startReviewAutoScroll = () => {
      clearInterval(reviewInterval);
      reviewInterval = setInterval(() => {
        reviewIndex = (reviewIndex + 1) % reviewCards.length;
        scrollReviews(reviewIndex);
      }, 4000);
    };

    const stopReviewAutoScroll = () => {
      clearInterval(reviewInterval);
    };

    // Scroll event to sync dots on manual scroll
    reviewsGrid.addEventListener('scroll', () => {
      stopReviewAutoScroll();
      
      let closestIndex = 0;
      let minDiff = Infinity;
      const scrollCenter = reviewsGrid.scrollLeft + reviewsGrid.clientWidth / 2;

      reviewCards.forEach((card, index) => {
        const cardCenter = card.offsetLeft - reviewsGrid.offsetLeft + card.clientWidth / 2;
        const diff = Math.abs(scrollCenter - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      if (reviewIndex !== closestIndex) {
        reviewIndex = closestIndex;
        updateReviewDots(reviewIndex);
      }
      
      // Resume auto scroll after a delay
      clearTimeout(reviewsGrid.scrollTimeout);
      reviewsGrid.scrollTimeout = setTimeout(startReviewAutoScroll, 4000);
    });

    // Dot click
    reviewDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopReviewAutoScroll();
        reviewIndex = index;
        scrollReviews(reviewIndex);
        startReviewAutoScroll();
      });
    });

    // Initialize auto scroll on mobile
    const reviewMQuery = window.matchMedia('(max-width: 768px)');
    const initReviews = (e) => {
      if (e.matches) {
        updateReviewDots(reviewIndex);
        startReviewAutoScroll();
      } else {
        stopReviewAutoScroll();
        reviewsGrid.scrollTo({ left: 0 }); // Reset on desktop
      }
    };
    reviewMQuery.addEventListener('change', initReviews);
    if (reviewMQuery.matches) initReviews(reviewMQuery);
  }

});

// Add fadeIn keyframe dynamically
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(style);

// ── Product Image Lightbox ──────────────────────────────────────────────────
(function initLightbox() {
  // Build the modal once
  const lb = document.createElement('div');
  lb.className = 'img-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <button class="lb-close" aria-label="Close">&times;</button>
    <div class="lb-zoom-hint">Scroll or pinch to zoom · Drag to pan</div>
    <div class="lb-img-wrap" id="lbImgWrap">
      <img id="lbImg" src="" alt="">
    </div>
    <div class="lb-zoom-controls">
      <button class="lb-zoom-btn" id="lbZoomIn" aria-label="Zoom in">+</button>
      <button class="lb-zoom-btn" id="lbZoomOut" aria-label="Zoom out">&#8722;</button>
    </div>
    <div class="lb-title" id="lbTitle"></div>
  `;
  document.body.appendChild(lb);

  const lbImg   = lb.querySelector('#lbImg');
  const lbWrap  = lb.querySelector('#lbImgWrap');
  const lbTitle = lb.querySelector('#lbTitle');
  const lbClose = lb.querySelector('.lb-close');
  const btnZoomIn  = lb.querySelector('#lbZoomIn');
  const btnZoomOut = lb.querySelector('#lbZoomOut');

  let scale = 1, panX = 0, panY = 0;
  let isDragging = false, startX = 0, startY = 0, lastPanX = 0, lastPanY = 0;

  function applyTransform() {
    lbImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1; panX = 0; panY = 0;
    lbImg.style.transition = 'transform 0.3s ease';
    applyTransform();
    setTimeout(() => lbImg.style.transition = 'transform 0.15s ease', 310);
  }

  function clampPan() {
    const maxPan = Math.max(0, (scale - 1) * lbWrap.clientWidth * 0.5);
    panX = Math.max(-maxPan, Math.min(maxPan, panX));
    panY = Math.max(-maxPan, Math.min(maxPan, panY));
  }

  function zoom(delta, cx, cy) {
    const prevScale = scale;
    scale = Math.max(1, Math.min(5, scale + delta));
    if (scale === prevScale) return;
    // Zoom toward cursor position
    const rect = lbWrap.getBoundingClientRect();
    const ox = (cx - rect.left - rect.width / 2) / prevScale;
    const oy = (cy - rect.top - rect.height / 2) / prevScale;
    panX += ox * (prevScale - scale);
    panY += oy * (prevScale - scale);
    if (scale === 1) { panX = 0; panY = 0; }
    else clampPan();
    applyTransform();
  }

  function openLightbox(src, title) {
    lbImg.src = src;
    lbImg.alt = title;
    lbTitle.textContent = title;
    resetTransform();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    // re-trigger hint animation
    const hint = lb.querySelector('.lb-zoom-hint');
    hint.style.animation = 'none';
    requestAnimationFrame(() => { hint.style.animation = ''; });
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  // Close on backdrop click
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  lbClose.addEventListener('click', closeLightbox);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === '+' || e.key === '=') zoom(0.3, lbWrap.getBoundingClientRect().left + lbWrap.clientWidth/2, lbWrap.getBoundingClientRect().top + lbWrap.clientHeight/2);
    if (e.key === '-') zoom(-0.3, lbWrap.getBoundingClientRect().left + lbWrap.clientWidth/2, lbWrap.getBoundingClientRect().top + lbWrap.clientHeight/2);
  });

  // Zoom buttons
  btnZoomIn.addEventListener('click', () => { const r = lbWrap.getBoundingClientRect(); zoom(0.5, r.left + r.width/2, r.top + r.height/2); });
  btnZoomOut.addEventListener('click', () => { const r = lbWrap.getBoundingClientRect(); zoom(-0.5, r.left + r.width/2, r.top + r.height/2); });

  // Mouse wheel zoom
  lbWrap.addEventListener('wheel', e => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.2 : -0.2, e.clientX, e.clientY);
  }, { passive: false });

  // Double-click reset
  lbWrap.addEventListener('dblclick', resetTransform);

  // Mouse drag pan
  lbWrap.addEventListener('mousedown', e => {
    if (scale <= 1) return;
    isDragging = true; lbWrap.classList.add('grabbing');
    startX = e.clientX - panX; startY = e.clientY - panY;
    lastPanX = panX; lastPanY = panY;
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    clampPan();
    lbImg.style.transition = 'none';
    applyTransform();
  });
  window.addEventListener('mouseup', () => {
    isDragging = false; lbWrap.classList.remove('grabbing');
    lbImg.style.transition = 'transform 0.15s ease';
  });

  // Touch pinch-zoom
  let lastTouchDist = 0;
  lbWrap.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      lastTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging = true;
      startX = e.touches[0].clientX - panX;
      startY = e.touches[0].clientY - panY;
    }
  }, { passive: true });
  lbWrap.addEventListener('touchmove', e => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      zoom((dist - lastTouchDist) * 0.01, midX, midY);
      lastTouchDist = dist;
    } else if (e.touches.length === 1 && isDragging) {
      panX = e.touches[0].clientX - startX;
      panY = e.touches[0].clientY - startY;
      clampPan();
      lbImg.style.transition = 'none';
      applyTransform();
    }
  }, { passive: false });
  lbWrap.addEventListener('touchend', () => {
    isDragging = false;
    lbImg.style.transition = 'transform 0.15s ease';
  });

  // ── Inject eye buttons on every product card image ──
  function injectEyeButtons() {
    document.querySelectorAll('.product-card .card-image').forEach(cardImg => {
      if (cardImg.querySelector('.card-eye-btn')) return; // already injected
      const img = cardImg.querySelector('img');
      if (!img) return;
      const btn = document.createElement('button');
      btn.className = 'card-eye-btn';
      btn.setAttribute('aria-label', 'View image');
      btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const title = img.closest('.product-card')?.querySelector('.card-title')?.textContent || img.alt || '';
        openLightbox(img.src, title);
      });
      cardImg.appendChild(btn);
    });
  }

  // Run now and also on DOM mutations (in case cards are dynamically added/shown)
  injectEyeButtons();
  const mo = new MutationObserver(injectEyeButtons);
  mo.observe(document.body, { childList: true, subtree: true });
})();


// ── Masala Scroll-Float Animation (Why Us section — desktop only) ─────────────
(function initMasalaFloat() {
  const img     = document.getElementById('masalaFloat');
  const section = document.getElementById('why-us');
  if (!img || !section) return;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  // ── Phase boundaries (as fractions of total scroll progress through section) ──
  // P_APPEAR : heading reaches upper-third of viewport — image starts entering
  // P_HOVER  : heading fully visible, image settled right-of-heading
  // P_DIAG   : half the card row has scrolled off top — diagonal exit begins
  // P_GONE   : image is fully off-screen left
  const P_APPEAR = 0.30;
  const P_HOVER  = 0.48;
  const P_DIAG   = 0.62;  // ≈ when ~half the card grid has left the top of screen
  const P_GONE   = 0.98;

  // Landing position: right side of the centered heading, slightly below it
  // (image top-left will be at ~70vw, ~24vh  →  image sits neatly right of heading)
  const LAND_TX  = 70;   // vw
  const LAND_TY  = 26;   // vh

  let ticking = false;

  function update() {
    ticking = false;

    // ── Desktop only ──
    if (window.innerWidth <= 1024) {
      img.style.opacity = '0';
      return;
    }

    const r  = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // prog: 0 = section just entered viewport from bottom,
    //        1 = section fully exited from top
    const prog = clamp((vh - r.top) / (r.height + vh), 0, 1);

    // Outside active window → hide
    if (prog <= P_APPEAR || prog >= P_GONE) {
      img.style.opacity = '0';
      return;
    }
    img.style.opacity = '1';

    let tx, ty, rot;

    if (prog < P_HOVER) {
      // ── Phase 1: Fly in from right edge to right-of-heading, rotating ──
      // Enters from off-screen right, arrives level with & right of the heading
      const t = ease((prog - P_APPEAR) / (P_HOVER - P_APPEAR));
      tx  = lerp(115,      LAND_TX, t);  // 115vw → 70vw  (enters from right)
      ty  = lerp(LAND_TY - 6, LAND_TY, t);  // slight downward diagonal
      rot = lerp(80,       22,      t);  // spinning in
    }
    else if (prog < P_DIAG) {
      // ── Phase 2: Hover to the right of heading, slow drift ──
      const t = ease((prog - P_HOVER) / (P_DIAG - P_HOVER));
      tx  = lerp(LAND_TX, LAND_TX + 1, t);
      ty  = lerp(LAND_TY, LAND_TY + 2, t);
      rot = lerp(22,      18,           t);
    }
    else {
      // ── Exit is 3 sub-phases ──────────────────────────────────────────────
      // 3a (P_DIAG → P_BELOW): diagonal + 360° spin → below first card
      // 3b (P_BELOW → P_WAIT) : hover below first card
      // 3c (P_WAIT  → P_GONE) : slide horizontally off to the left
      const P_BELOW = 0.72;  // landed below first card
      const P_WAIT  = 0.80;  // start horizontal exit
      // Position below first card — cards have scrolled up so lower-left viewport is clear
      const BLW_TX  = 5;    // vw — near left edge, below where first card is
      const BLW_TY  = 48;   // vh — just below card bottom edge (matches ideal marked position)

      if (prog < P_BELOW) {
        // 3a: diagonal diagonal down-left with 360° rotation
        const t = ease((prog - P_DIAG) / (P_BELOW - P_DIAG));
        tx  = lerp(LAND_TX + 1, BLW_TX, t);
        ty  = lerp(LAND_TY + 2, BLW_TY, t);
        rot = lerp(22,          22 - 360, t);  // full 360° counter-clockwise
      } else if (prog < P_WAIT) {
        // 3b: hover below first card, gentle slow spin
        const t = ease((prog - P_BELOW) / (P_WAIT - P_BELOW));
        tx  = lerp(BLW_TX,      BLW_TX - 1, t);
        ty  = lerp(BLW_TY,      BLW_TY + 1, t);
        rot = lerp(22 - 360,    22 - 380,    t);  // ~20° more drift
      } else {
        // 3c: exit horizontally from left edge
        const t = ease((prog - P_WAIT) / (P_GONE - P_WAIT));
        tx  = lerp(BLW_TX - 1, -120, t);
        ty  = lerp(BLW_TY + 1, BLW_TY + 2, t);  // barely any vertical change
        rot = lerp(22 - 380,   22 - 430,    t);  // gentle extra spin while sliding
      }
    }

    img.style.transform = `translate(${tx}vw, ${ty}vh) rotate(${rot}deg)`;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  window.addEventListener('resize', () => {
    requestAnimationFrame(update);
  }, { passive: true });

  update();
})();


