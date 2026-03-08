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
