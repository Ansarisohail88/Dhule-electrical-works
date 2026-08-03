/**
 * Dhule Electrical Works - Main JavaScript
 * Dynamic Configuration Binding & Protected Admin Panel
 * Interactive Features: Dark Mode, Service Search/Filter, Pricing Calculator,
 * Before/After Slider, Lightbox, FAQ Accordion, Booking Modal, PWA Registration,
 * Password-Protected Admin Panel with LocalStorage Persistence
 */

// Global state
let SERVICES_DATA = [];
let ADMIN_AUTHENTICATED = false;
let TEMP_SERVICES = [];
let TEMP_GALLERY = [];
let TEMP_REVIEWS = [];

// Helper to safely get nested config properties
function getProp(path, fallback = '') {
  if (!window.CONFIG) return fallback;
  const parts = path.split('.');
  let current = window.CONFIG;
  for (const p of parts) {
    if (current && current[p] !== undefined) {
      current = current[p];
    } else {
      return fallback;
    }
  }
  return current !== undefined ? current : fallback;
}

// --- LocalStorage Config Management ---
function loadEffectiveConfig() {
  const stored = localStorage.getItem('dhule_site_config');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      window.CONFIG = Object.assign({}, window.CONFIG || {}, parsed);
    } catch (e) {
      console.error('Failed to parse stored config from localStorage', e);
    }
  }
  if (window.CONFIG) {
    SERVICES_DATA = Array.isArray(window.CONFIG.services) ? window.CONFIG.services : [];
  }
}

function saveEffectiveConfig(newConfig) {
  window.CONFIG = newConfig;
  SERVICES_DATA = Array.isArray(newConfig.services) ? newConfig.services : [];
  localStorage.setItem('dhule_site_config', JSON.stringify(newConfig));

  applyConfigToDOM();
  renderServices(SERVICES_DATA);
  renderGallery(window.CONFIG.gallery || []);
  renderReviews(window.CONFIG.reviews || []);
  initPricingCalculator();
}

function resetEffectiveConfig() {
  if (confirm('Are you sure you want to reset all custom edits and restore original default settings?')) {
    localStorage.removeItem('dhule_site_config');
    showToast('Factory default settings restored. Reloading page...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// --- DOM Ready Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Load effective config from localStorage if available
  loadEffectiveConfig();

  // Apply central business config variables to DOM
  applyConfigToDOM();

  initPreloader();
  initThemeToggle();
  initMobileNav();
  initScrollTop();

  // Render dynamic sections
  renderServices(SERVICES_DATA);
  renderGallery(window.CONFIG ? window.CONFIG.gallery : []);
  renderReviews(window.CONFIG ? window.CONFIG.reviews : []);

  initServiceSearchAndFilter();
  initPricingCalculator();
  initBeforeAfterSlider();
  initFAQAccordion();
  initModals();
  initForms();
  initAdminPanel();
  registerServiceWorker();
});

// --- Dynamic Business Configuration Applicator ---
function applyConfigToDOM() {
  if (!window.CONFIG) return;

  // Re-sync SERVICES_DATA if config loaded
  if (Array.isArray(window.CONFIG.services)) {
    SERVICES_DATA = window.CONFIG.services;
  }

  // 1. Update text content for data-config elements
  document.querySelectorAll('[data-config]').forEach(el => {
    const path = el.getAttribute('data-config');
    const val = getProp(path);
    if (val !== undefined && val !== null && val !== '') {
      el.textContent = val;
    }
  });

  // 2. Update HTML content for data-config-html elements
  document.querySelectorAll('[data-config-html]').forEach(el => {
    const path = el.getAttribute('data-config-html');
    const val = getProp(path);
    if (val) el.innerHTML = val;
  });

  // 3. Update telephone links & displays
  const phone = getProp('contact.phone', '+919876543210');
  const phoneDisplay = getProp('contact.phoneDisplay', phone);
  
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.href = `tel:${phone}`;
    if (a.textContent.includes('Emergency Call:')) {
      a.innerHTML = `<i class="fa-solid fa-phone" style="color: var(--secondary);"></i> Emergency Call: ${phoneDisplay}`;
    } else if (a.textContent.includes('Call Now (')) {
      a.innerHTML = `<i class="fa-solid fa-phone"></i> Call Now (${phoneDisplay})`;
    } else if (a.textContent.trim().startsWith('+91')) {
      a.textContent = phoneDisplay;
    }
  });

  // 4. Update WhatsApp links
  const waNum = getProp('contact.whatsappNumber', '919876543210');
  document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
    try {
      const url = new URL(a.href);
      const textParam = url.searchParams.get('text');
      let newHref = `https://wa.me/${waNum}`;
      if (textParam) {
        newHref += `?text=${encodeURIComponent(textParam)}`;
      }
      a.href = newHref;
    } catch (e) {
      a.href = `https://wa.me/${waNum}`;
    }
  });

  // 5. Update Map iframe URL
  const mapUrl = getProp('location.googleMapEmbedUrl');
  const mapIframe = document.getElementById('map-iframe');
  if (mapIframe && mapUrl) {
    mapIframe.src = mapUrl;
  }

  // 6. Update Address elements
  const address = getProp('location.address');
  document.querySelectorAll('.config-address').forEach(el => {
    if (address) el.textContent = address;
  });

  // 7. Update Coverage Area Badges
  const areas = getProp('location.coverageAreas');
  const badgesContainer = document.getElementById('coverage-area-badges');
  if (badgesContainer && Array.isArray(areas)) {
    badgesContainer.innerHTML = areas.map(area => `
      <span class="section-badge" style="background: var(--bg-elevated);"><i class="fa-solid fa-location-pin"></i> ${area}</span>
    `).join('');
  }

  // 8. Update Location Options in Quick Form
  const heroAreaSelect = document.getElementById('hero-area');
  if (heroAreaSelect && Array.isArray(areas)) {
    heroAreaSelect.innerHTML = areas.map(area => `
      <option value="${area}">${area}</option>
    `).join('') + `<option value="Other Area">Other Area in ${getProp('location.city', 'Dhule')}</option>`;
  }

  // 9. Update Business Hours
  const days = getProp('businessHours.days', 'Monday - Sunday');
  const time = getProp('businessHours.time', '24 Hours Open');
  const responseTime = getProp('businessHours.responseTime', '20-25 Mins');

  const hoursTable = document.querySelector('.hours-table');
  if (hoursTable) {
    hoursTable.innerHTML = `
      <tr>
        <td>${days}</td>
        <td class="text-right" style="color: var(--accent-green); font-weight: 700;">${time}</td>
      </tr>
      <tr>
        <td>Emergency Arrival</td>
        <td class="text-right" style="font-weight: 700;">${responseTime}</td>
      </tr>
    `;
  }
}

// --- Preloader ---
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 300);
    });
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1500);
  }
}

// --- Dark Mode Toggle ---
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

  const savedTheme = localStorage.getItem('dhule_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dhule_theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }
}

// --- Mobile Navigation ---
function initMobileNav() {
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggleBtn.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (mobileToggleBtn.querySelector('i')) {
          mobileToggleBtn.querySelector('i').className = 'fa-solid fa-bars';
        }
      });
    });
  }

  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    const header = document.querySelector('.site-header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
}

// --- Scroll To Top Button ---
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// --- Dynamic Gallery Rendering ---
function renderGallery(galleryItems) {
  const container = document.querySelector('.gallery-grid');
  if (!container) return;

  if (!galleryItems || galleryItems.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem;" class="glass-card">
        <p style="color: var(--text-muted);">No gallery images available.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = galleryItems.map(item => `
    <div class="gallery-item">
      <img src="${item.image}" alt="${item.title}" referrerPolicy="no-referrer" />
      <div class="gallery-overlay">
        <h4>${item.title}</h4>
        <span>${item.location}</span>
      </div>
    </div>
  `).join('');

  // Re-bind Lightbox Triggering
  container.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4')?.textContent || 'Dhule Electrical Project';
      const lightboxModal = document.getElementById('lightbox-modal');
      const lightboxImg = document.getElementById('lightbox-target-img');
      const lightboxCaption = document.getElementById('lightbox-caption');

      if (lightboxImg && lightboxModal) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightboxModal.classList.add('open');
      }
    });
  });
}

// --- Dynamic Reviews Rendering ---
function renderReviews(reviewsItems) {
  const container = document.getElementById('reviews-grid-container');
  if (!container) return;

  if (!reviewsItems || reviewsItems.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem;" class="glass-card">
        <p style="color: var(--text-muted);">No customer reviews available.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reviewsItems.map(r => {
    const starCount = r.stars || 5;
    const starsHtml = Array(starCount).fill('<i class="fa-solid fa-star"></i>').join('');
    const avatarLetter = (r.name || 'C').charAt(0).toUpperCase();

    return `
      <div class="glass-card review-card">
        <div class="review-stars">${starsHtml}</div>
        <p class="review-text">"${r.comment}"</p>
        <div class="reviewer-meta">
          <div class="reviewer-avatar">${avatarLetter}</div>
          <div class="reviewer-info">
            <h4>${r.name}</h4>
            <span>${r.location}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- Services Rendering & Search / Filtering ---
function renderServices(services) {
  const container = document.getElementById('services-grid-container');
  if (!container) return;

  if (services.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;" class="glass-card">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3>No services match your search</h3>
        <p style="color: var(--text-muted);">Try searching for "Wiring", "MCB", "Inverter", "Fan", or "Motor".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = services.map(s => `
    <div class="glass-card service-card" data-category="${s.category}">
      <div>
        <div class="service-header">
          <div class="service-icon">
            <i class="fa-solid ${s.icon || 'fa-bolt'}"></i>
          </div>
          <div class="service-title-box">
            <span class="service-tag">${s.tag || 'Service'}</span>
            <h3>${s.title}</h3>
          </div>
        </div>
        <p class="service-desc">${s.desc}</p>
      </div>
      <div class="service-footer">
        <span class="service-price">${s.price}</span>
        <button class="btn btn-primary btn-sm open-booking-btn" data-service="${s.title}">
          <i class="fa-solid fa-calendar-check"></i> Book Now
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.open-booking-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = e.currentTarget.getAttribute('data-service');
      openBookingModal(serviceName);
    });
  });
}

function initServiceSearchAndFilter() {
  const searchInput = document.getElementById('service-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let currentCategory = 'all';
  let currentQuery = '';

  function applyFilters() {
    let filtered = SERVICES_DATA.filter(s => {
      const matchesCategory = currentCategory === 'all' || s.category === currentCategory;
      const matchesSearch = s.title.toLowerCase().includes(currentQuery) ||
                            s.desc.toLowerCase().includes(currentQuery) ||
                            (s.tag && s.tag.toLowerCase().includes(currentQuery));
      return matchesCategory && matchesSearch;
    });
    renderServices(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  });
}

// --- Interactive Pricing Calculator ---
function initPricingCalculator() {
  const serviceSelect = document.getElementById('calc-service');
  const pointCountInput = document.getElementById('calc-points');
  const pointDisplay = document.getElementById('calc-points-val');
  const urgencySelect = document.getElementById('calc-urgency');
  const priceDisplay = document.getElementById('calc-price-display');
  const bookEstimateBtn = document.getElementById('calc-book-btn');

  if (!serviceSelect || !priceDisplay) return;

  const baseRates = (window.CONFIG && window.CONFIG.pricing && window.CONFIG.pricing.baseRates)
    ? window.CONFIG.pricing.baseRates
    : {
      'wiring': 250,
      'light-fan': 150,
      'mcb': 300,
      'inverter': 500,
      'motor': 450,
      'repair': 200
    };

  function calculate() {
    const selected = serviceSelect.value;
    const count = parseInt(pointCountInput.value) || 1;
    const urgency = parseFloat(urgencySelect.value) || 1.0;

    if (pointDisplay) pointDisplay.textContent = count;

    let base = baseRates[selected] || 200;
    let total = 0;

    if (selected === 'wiring' || selected === 'light-fan') {
      total = base * count * urgency;
    } else {
      total = (base + (count - 1) * 100) * urgency;
    }

    total = Math.round(total);
    priceDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  serviceSelect.addEventListener('change', calculate);
  pointCountInput.addEventListener('input', calculate);
  urgencySelect.addEventListener('change', calculate);

  if (bookEstimateBtn) {
    bookEstimateBtn.addEventListener('click', () => {
      const selectedText = serviceSelect.options[serviceSelect.selectedIndex].text;
      const estimatedPrice = priceDisplay.textContent;
      openBookingModal(`${selectedText} (Est. ${estimatedPrice})`);
    });
  }

  calculate();
}

// --- Before/After Image Comparison Slider ---
function initBeforeAfterSlider() {
  const container = document.querySelector('.before-after-container');
  const afterImage = document.querySelector('.ba-after');
  const handle = document.querySelector('.ba-slider-handle');

  if (!container || !afterImage || !handle) return;

  let isDragging = false;

  function updatePosition(x) {
    const rect = container.getBoundingClientRect();
    let position = x - rect.left;

    if (position < 0) position = 0;
    if (position > rect.width) position = rect.width;

    const percentage = (position / rect.width) * 100;
    afterImage.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  });
}

// --- FAQ Accordion ---
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// --- Modals & Lightbox Popups ---
function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn') || e.target.closest('.modal-close-btn-action')) {
        closeAllModals();
      }
    });
  });

  const emergencyBtns = document.querySelectorAll('.open-emergency-btn');
  const emergencyModal = document.getElementById('emergency-modal');
  emergencyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (emergencyModal) emergencyModal.classList.add('open');
    });
  });
}

function openBookingModal(preselectedService = '') {
  const modal = document.getElementById('booking-modal');
  const serviceInput = document.getElementById('booking-service-input');
  if (modal) {
    if (serviceInput && preselectedService) {
      serviceInput.value = preselectedService;
    }
    modal.classList.add('open');
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

// --- Forms & Direct WhatsApp Redirect ---
function initForms() {
  const waNum = getProp('contact.whatsappNumber', '919876543210');
  const bizName = getProp('business.name', 'Dhule Electrical Works');

  const bookingForm = document.getElementById('service-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = document.getElementById('booking-service-input').value;
      const name = document.getElementById('booking-name').value;
      const phone = document.getElementById('booking-phone').value;
      const location = document.getElementById('booking-location').value;
      const date = document.getElementById('booking-date').value;

      const message = `Hi ${bizName},%0A%0A*Service Request:* ${encodeURIComponent(service)}%0A*Customer Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Location:* ${encodeURIComponent(location)}%0A*Preferred Date/Time:* ${encodeURIComponent(date)}%0A%0APlease confirm availability.`;

      const whatsappUrl = `https://wa.me/${waNum}?text=${message}`;

      closeAllModals();
      showToast('Redirecting to WhatsApp with your booking details...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    });
  }

  const contactForm = document.getElementById('general-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const phone = document.getElementById('contact-phone').value;
      const area = document.getElementById('contact-area').value;
      const message = document.getElementById('contact-msg').value;

      const waMsg = `Hi ${bizName},%0A%0AMy name is *${encodeURIComponent(name)}* (${encodeURIComponent(phone)}).%0A*Location:* ${encodeURIComponent(area)}.%0A*Message:* ${encodeURIComponent(message)}`;

      showToast('Opening WhatsApp to send your message...');
      setTimeout(() => {
        window.open(`https://wa.me/${waNum}?text=${waMsg}`, '_blank');
        contactForm.reset();
      }, 1000);
    });
  }

  const reviewForm = document.getElementById('add-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rev-name').value;
      const location = document.getElementById('rev-location').value;
      const comment = document.getElementById('rev-comment').value;

      const newReview = {
        id: `rev-${Date.now()}`,
        name: name,
        location: location,
        stars: 5,
        comment: comment
      };

      if (!window.CONFIG.reviews) window.CONFIG.reviews = [];
      window.CONFIG.reviews.unshift(newReview);
      saveEffectiveConfig(window.CONFIG);

      closeAllModals();
      showToast('Thank you! Your review has been saved and published.');
      reviewForm.reset();
    });
  }
}

// --- ADMIN PANEL LOGIC & PASSWORD PROTECTION ---
function initAdminPanel() {
  const openAdminBtn = document.getElementById('open-admin-btn');
  const footerOpenAdminBtn = document.getElementById('footer-open-admin-btn');
  const adminLoginModal = document.getElementById('admin-login-modal');
  const adminPanelModal = document.getElementById('admin-panel-modal');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPassInput = document.getElementById('admin-pass-input');

  // Trigger admin login or admin panel
  function handleOpenAdmin(e) {
    if (e) e.preventDefault();
    if (ADMIN_AUTHENTICATED) {
      populateAdminPanelForms();
      if (adminPanelModal) adminPanelModal.classList.add('open');
    } else {
      if (adminPassInput) adminPassInput.value = '';
      if (adminLoginModal) adminLoginModal.classList.add('open');
    }
  }

  if (openAdminBtn) openAdminBtn.addEventListener('click', handleOpenAdmin);
  if (footerOpenAdminBtn) footerOpenAdminBtn.addEventListener('click', handleOpenAdmin);

  // Admin Login submit
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPass = adminPassInput.value.trim();
      const actualPass = getProp('adminPassword', 'admin123');

      if (enteredPass === actualPass) {
        ADMIN_AUTHENTICATED = true;
        closeAllModals();
        populateAdminPanelForms();
        if (adminPanelModal) adminPanelModal.classList.add('open');
        showToast('Admin Access Granted!');
      } else {
        showToast('Incorrect password! Default is admin123');
      }
    });
  }

  // Admin Tab Navigation
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Save Buttons
  const saveTopBtn = document.getElementById('admin-save-top-btn');
  const saveBottomBtn = document.getElementById('admin-save-bottom-btn');

  function saveAdminChanges() {
    // 1. General
    const updatedConfig = JSON.parse(JSON.stringify(window.CONFIG || {}));
    if (!updatedConfig.business) updatedConfig.business = {};
    updatedConfig.business.name = document.getElementById('adm-biz-name').value;
    updatedConfig.business.shortName = document.getElementById('adm-biz-shortName').value;
    updatedConfig.business.tagline = document.getElementById('adm-biz-tagline').value;
    updatedConfig.business.subTagline = document.getElementById('adm-biz-subTagline').value;
    updatedConfig.business.ownerName = document.getElementById('adm-biz-ownerName').value;
    updatedConfig.business.experienceYears = document.getElementById('adm-biz-experienceYears').value;
    updatedConfig.business.satisfiedCustomers = document.getElementById('adm-biz-satisfiedCustomers').value;
    updatedConfig.business.avgArrivalTime = document.getElementById('adm-biz-avgArrivalTime').value;
    updatedConfig.business.guarantee = document.getElementById('adm-biz-guarantee').value;

    // 2. Contact & Address
    if (!updatedConfig.contact) updatedConfig.contact = {};
    updatedConfig.contact.phone = document.getElementById('adm-contact-phone').value;
    updatedConfig.contact.phoneDisplay = document.getElementById('adm-contact-phoneDisplay').value;
    updatedConfig.contact.whatsappNumber = document.getElementById('adm-contact-whatsappNumber').value;
    updatedConfig.contact.email = document.getElementById('adm-contact-email').value;

    if (!updatedConfig.location) updatedConfig.location = {};
    updatedConfig.location.address = document.getElementById('adm-location-address').value;
    updatedConfig.location.landmark = document.getElementById('adm-location-landmark').value;
    updatedConfig.location.city = document.getElementById('adm-location-city').value;
    updatedConfig.location.state = document.getElementById('adm-location-state').value;
    updatedConfig.location.pincode = document.getElementById('adm-location-pincode').value;
    updatedConfig.location.googleMapEmbedUrl = document.getElementById('adm-location-mapUrl').value;

    const rawAreas = document.getElementById('adm-location-coverageAreas').value;
    updatedConfig.location.coverageAreas = rawAreas.split(',').map(s => s.trim()).filter(Boolean);

    // 3. Hours
    if (!updatedConfig.businessHours) updatedConfig.businessHours = {};
    updatedConfig.businessHours.days = document.getElementById('adm-hours-days').value;
    updatedConfig.businessHours.time = document.getElementById('adm-hours-time').value;
    updatedConfig.businessHours.status = document.getElementById('adm-hours-status').value;
    updatedConfig.businessHours.responseTime = document.getElementById('adm-hours-responseTime').value;

    // 4. Calculator Base Rates
    if (!updatedConfig.pricing) updatedConfig.pricing = { baseRates: {} };
    if (!updatedConfig.pricing.baseRates) updatedConfig.pricing.baseRates = {};
    updatedConfig.pricing.baseRates.wiring = parseInt(document.getElementById('adm-rate-wiring').value) || 250;
    updatedConfig.pricing.baseRates['light-fan'] = parseInt(document.getElementById('adm-rate-light-fan').value) || 150;
    updatedConfig.pricing.baseRates.mcb = parseInt(document.getElementById('adm-rate-mcb').value) || 300;
    updatedConfig.pricing.baseRates.inverter = parseInt(document.getElementById('adm-rate-inverter').value) || 500;
    updatedConfig.pricing.baseRates.motor = parseInt(document.getElementById('adm-rate-motor').value) || 450;
    updatedConfig.pricing.baseRates.repair = parseInt(document.getElementById('adm-rate-repair').value) || 200;

    // 5. Services, Gallery, Reviews lists from DOM forms
    updatedConfig.services = getServicesFromAdminDOM();
    updatedConfig.gallery = getGalleryFromAdminDOM();
    updatedConfig.reviews = getReviewsFromAdminDOM();

    // 6. New Admin Password
    const newPass = document.getElementById('adm-new-password').value.trim();
    if (newPass) {
      updatedConfig.adminPassword = newPass;
    }

    saveEffectiveConfig(updatedConfig);
    closeAllModals();
    showToast('Website business details updated & saved to local storage!');
  }

  if (saveTopBtn) saveTopBtn.addEventListener('click', saveAdminChanges);
  if (saveBottomBtn) saveBottomBtn.addEventListener('click', saveAdminChanges);

  // Reset & Actions
  const resetBtn = document.getElementById('admin-reset-btn');
  const resetDefaultsBtn = document.getElementById('adm-reset-defaults-btn');

  if (resetBtn) resetBtn.addEventListener('click', resetEffectiveConfig);
  if (resetDefaultsBtn) resetDefaultsBtn.addEventListener('click', resetEffectiveConfig);

  // Export JSON
  const exportBtn = document.getElementById('adm-export-json-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.CONFIG, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "dhule_electrical_config.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Configuration JSON downloaded');
    });
  }

  // Add Service Button
  const addServiceBtn = document.getElementById('adm-add-service-btn');
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
      TEMP_SERVICES.unshift({
        id: `svc-${Date.now()}`,
        title: 'New Service Item',
        category: 'residential',
        icon: 'fa-bolt',
        price: '₹299 onwards',
        tag: 'Quick Fix',
        desc: 'Description of the new electrical service for home or shop in Dhule.'
      });
      renderAdminServicesList();
    });
  }

  // Add Gallery Button
  const addGalleryBtn = document.getElementById('adm-add-gallery-btn');
  if (addGalleryBtn) {
    addGalleryBtn.addEventListener('click', () => {
      TEMP_GALLERY.unshift({
        id: `gal-${Date.now()}`,
        title: 'New Electrical Project',
        location: 'Deopur, Dhule',
        image: 'https://picsum.photos/seed/elec-' + Math.floor(Math.random() * 1000) + '/800/600'
      });
      renderAdminGalleryList();
    });
  }

  // Add Review Button
  const addReviewBtn = document.getElementById('adm-add-review-btn');
  if (addReviewBtn) {
    addReviewBtn.addEventListener('click', () => {
      TEMP_REVIEWS.unshift({
        id: `rev-${Date.now()}`,
        name: 'Satisfied Customer',
        location: 'Sakri Road, Dhule',
        stars: 5,
        comment: 'Great service! Electrician arrived on time and fixed our wiring issue cleanly.'
      });
      renderAdminReviewsList();
    });
  }
}

function populateAdminPanelForms() {
  const c = window.CONFIG || {};

  // General
  document.getElementById('adm-biz-name').value = getProp('business.name');
  document.getElementById('adm-biz-shortName').value = getProp('business.shortName');
  document.getElementById('adm-biz-tagline').value = getProp('business.tagline');
  document.getElementById('adm-biz-subTagline').value = getProp('business.subTagline');
  document.getElementById('adm-biz-ownerName').value = getProp('business.ownerName');
  document.getElementById('adm-biz-experienceYears').value = getProp('business.experienceYears');
  document.getElementById('adm-biz-satisfiedCustomers').value = getProp('business.satisfiedCustomers');
  document.getElementById('adm-biz-avgArrivalTime').value = getProp('business.avgArrivalTime');
  document.getElementById('adm-biz-guarantee').value = getProp('business.guarantee');

  // Contact
  document.getElementById('adm-contact-phone').value = getProp('contact.phone');
  document.getElementById('adm-contact-phoneDisplay').value = getProp('contact.phoneDisplay');
  document.getElementById('adm-contact-whatsappNumber').value = getProp('contact.whatsappNumber');
  document.getElementById('adm-contact-email').value = getProp('contact.email');
  document.getElementById('adm-location-address').value = getProp('location.address');
  document.getElementById('adm-location-landmark').value = getProp('location.landmark');
  document.getElementById('adm-location-city').value = getProp('location.city');
  document.getElementById('adm-location-state').value = getProp('location.state');
  document.getElementById('adm-location-pincode').value = getProp('location.pincode');
  document.getElementById('adm-location-mapUrl').value = getProp('location.googleMapEmbedUrl');

  const areas = getProp('location.coverageAreas') || [];
  document.getElementById('adm-location-coverageAreas').value = Array.isArray(areas) ? areas.join(', ') : '';

  // Hours
  document.getElementById('adm-hours-days').value = getProp('businessHours.days');
  document.getElementById('adm-hours-time').value = getProp('businessHours.time');
  document.getElementById('adm-hours-status').value = getProp('businessHours.status');
  document.getElementById('adm-hours-responseTime').value = getProp('businessHours.responseTime');

  // Pricing Base Rates
  const rates = getProp('pricing.baseRates') || {};
  document.getElementById('adm-rate-wiring').value = rates.wiring || 250;
  document.getElementById('adm-rate-light-fan').value = rates['light-fan'] || 150;
  document.getElementById('adm-rate-mcb').value = rates.mcb || 300;
  document.getElementById('adm-rate-inverter').value = rates.inverter || 500;
  document.getElementById('adm-rate-motor').value = rates.motor || 450;
  document.getElementById('adm-rate-repair').value = rates.repair || 200;

  // Clone items for Admin list editing
  TEMP_SERVICES = JSON.parse(JSON.stringify(c.services || []));
  TEMP_GALLERY = JSON.parse(JSON.stringify(c.gallery || []));
  TEMP_REVIEWS = JSON.parse(JSON.stringify(c.reviews || []));

  renderAdminServicesList();
  renderAdminGalleryList();
  renderAdminReviewsList();

  document.getElementById('adm-new-password').value = getProp('adminPassword', 'admin123');
}

// --- Render Editable Lists in Admin Panel ---
function renderAdminServicesList() {
  const container = document.getElementById('adm-services-list');
  const countEl = document.getElementById('adm-services-count');
  if (!container) return;

  if (countEl) countEl.textContent = TEMP_SERVICES.length;

  if (TEMP_SERVICES.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No services configured. Click 'Add New Service' above.</p>`;
    return;
  }

  container.innerHTML = TEMP_SERVICES.map((s, idx) => `
    <div class="admin-item-card" data-index="${idx}">
      <div class="admin-item-header">
        <h4><i class="fa-solid ${s.icon || 'fa-bolt'}" style="color: var(--primary);"></i> Service #${idx + 1}: ${s.title}</h4>
        <button class="btn-danger-sm adm-del-service-btn" data-index="${idx}">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
      <div class="admin-grid-2">
        <div class="admin-form-group">
          <label>Title</label>
          <input type="text" class="adm-svc-title" value="${s.title}" />
        </div>
        <div class="admin-form-group">
          <label>Price Display</label>
          <input type="text" class="adm-svc-price" value="${s.price}" />
        </div>
        <div class="admin-form-group">
          <label>Category</label>
          <select class="adm-svc-category">
            <option value="residential" ${s.category === 'residential' ? 'selected' : ''}>Residential</option>
            <option value="commercial" ${s.category === 'commercial' ? 'selected' : ''}>Commercial</option>
            <option value="emergency" ${s.category === 'emergency' ? 'selected' : ''}>Emergency</option>
          </select>
        </div>
        <div class="admin-form-group">
          <label>Tag / Badge</label>
          <input type="text" class="adm-svc-tag" value="${s.tag || ''}" />
        </div>
        <div class="admin-form-group">
          <label>FontAwesome Icon Class (e.g. fa-house-plug)</label>
          <input type="text" class="adm-svc-icon" value="${s.icon || 'fa-bolt'}" />
        </div>
        <div class="admin-form-group" style="grid-column: 1 / -1;">
          <label>Description</label>
          <textarea class="adm-svc-desc" rows="2">${s.desc}</textarea>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.adm-del-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      TEMP_SERVICES.splice(index, 1);
      renderAdminServicesList();
    });
  });
}

function getServicesFromAdminDOM() {
  const cards = document.querySelectorAll('#adm-services-list .admin-item-card');
  const services = [];

  cards.forEach((card, idx) => {
    services.push({
      id: TEMP_SERVICES[idx]?.id || `svc-${idx}-${Date.now()}`,
      title: card.querySelector('.adm-svc-title').value,
      price: card.querySelector('.adm-svc-price').value,
      category: card.querySelector('.adm-svc-category').value,
      tag: card.querySelector('.adm-svc-tag').value,
      icon: card.querySelector('.adm-svc-icon').value,
      desc: card.querySelector('.adm-svc-desc').value
    });
  });

  return services;
}

function renderAdminGalleryList() {
  const container = document.getElementById('adm-gallery-list');
  if (!container) return;

  if (TEMP_GALLERY.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No gallery images added. Click 'Add New Image' above.</p>`;
    return;
  }

  container.innerHTML = TEMP_GALLERY.map((g, idx) => `
    <div class="admin-item-card" data-index="${idx}">
      <div class="admin-item-header">
        <h4><i class="fa-solid fa-image" style="color: var(--primary);"></i> Image #${idx + 1}: ${g.title}</h4>
        <button class="btn-danger-sm adm-del-gal-btn" data-index="${idx}">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
      <div class="admin-grid-2">
        <div class="admin-form-group">
          <label>Title / Caption</label>
          <input type="text" class="adm-gal-title" value="${g.title}" />
        </div>
        <div class="admin-form-group">
          <label>Location / Tagline</label>
          <input type="text" class="adm-gal-location" value="${g.location}" />
        </div>
        <div class="admin-form-group" style="grid-column: 1 / -1;">
          <label>Image Source (URL or Upload File below)</label>
          <input type="text" class="adm-gal-image" value="${g.image}" />
          <input type="file" class="adm-gal-file-input" accept="image/*" style="margin-top: 0.5rem; font-size: 0.8rem;" data-index="${idx}" />
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.adm-del-gal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      TEMP_GALLERY.splice(index, 1);
      renderAdminGalleryList();
    });
  });

  // Handle local file upload -> convert to base64 Data URL for offline preservation
  container.querySelectorAll('.adm-gal-file-input').forEach(fileInput => {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const idx = e.target.getAttribute('data-index');
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const urlInput = container.querySelectorAll('.adm-gal-image')[idx];
          if (urlInput) {
            urlInput.value = uploadEvent.target.result;
            showToast('Image uploaded and converted for offline saving!');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

function getGalleryFromAdminDOM() {
  const cards = document.querySelectorAll('#adm-gallery-list .admin-item-card');
  const items = [];

  cards.forEach((card, idx) => {
    items.push({
      id: TEMP_GALLERY[idx]?.id || `gal-${idx}-${Date.now()}`,
      title: card.querySelector('.adm-gal-title').value,
      location: card.querySelector('.adm-gal-location').value,
      image: card.querySelector('.adm-gal-image').value
    });
  });

  return items;
}

function renderAdminReviewsList() {
  const container = document.getElementById('adm-reviews-list');
  if (!container) return;

  if (TEMP_REVIEWS.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">No reviews added. Click 'Add Customer Review' above.</p>`;
    return;
  }

  container.innerHTML = TEMP_REVIEWS.map((r, idx) => `
    <div class="admin-item-card" data-index="${idx}">
      <div class="admin-item-header">
        <h4><i class="fa-solid fa-star" style="color: var(--secondary);"></i> Review #${idx + 1}: ${r.name}</h4>
        <button class="btn-danger-sm adm-del-rev-btn" data-index="${idx}">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
      <div class="admin-grid-2">
        <div class="admin-form-group">
          <label>Customer Name</label>
          <input type="text" class="adm-rev-name" value="${r.name}" />
        </div>
        <div class="admin-form-group">
          <label>Location / Status</label>
          <input type="text" class="adm-rev-location" value="${r.location}" />
        </div>
        <div class="admin-form-group">
          <label>Rating Stars (1 - 5)</label>
          <input type="number" class="adm-rev-stars" min="1" max="5" value="${r.stars || 5}" />
        </div>
        <div class="admin-form-group" style="grid-column: 1 / -1;">
          <label>Comment / Testimonial</label>
          <textarea class="adm-rev-comment" rows="2">${r.comment}</textarea>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.adm-del-rev-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      TEMP_REVIEWS.splice(index, 1);
      renderAdminReviewsList();
    });
  });
}

function getReviewsFromAdminDOM() {
  const cards = document.querySelectorAll('#adm-reviews-list .admin-item-card');
  const reviews = [];

  cards.forEach((card, idx) => {
    reviews.push({
      id: TEMP_REVIEWS[idx]?.id || `rev-${idx}-${Date.now()}`,
      name: card.querySelector('.adm-rev-name').value,
      location: card.querySelector('.adm-rev-location').value,
      stars: parseInt(card.querySelector('.adm-rev-stars').value) || 5,
      comment: card.querySelector('.adm-rev-comment').value
    });
  });

  return reviews;
}

// --- Toast Notification Helper ---
function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--secondary); margin-right: 0.5rem;"></i> ${msg}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- Service Worker Registration (PWA) ---
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch(err => console.log('[PWA] Service Worker registration failed:', err));
    });
  }

  window.addEventListener('offline', () => {
    showToast('You are currently offline. Pages are served from offline cache.');
  });
  window.addEventListener('online', () => {
    showToast('Back online! Live call and map features restored.');
  });
}
