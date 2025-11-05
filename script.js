// Basic interactions for modals and simple OTP flow
document.addEventListener('DOMContentLoaded', function () {
    // modal helpers
    function openModal(id) {
      const m = document.getElementById(id);
      if (!m) return;
      m.setAttribute('aria-hidden', 'false');
    }
    function closeModal(el) {
      const modal = el.closest('.modal');
      if (modal) modal.setAttribute('aria-hidden', 'true');
    }
    // attach close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', function(){ closeModal(this) });
    });
    // click overlay to close
    document.querySelectorAll('.modal').forEach(m=>{
      m.addEventListener('click', (e)=>{
        if (e.target === m) m.setAttribute('aria-hidden','true');
      });
    });
  
    const loginBtn = document.getElementById('loginBtn');
    const bookNow = document.getElementById('bookNow');
  
    // open login modal
    loginBtn && loginBtn.addEventListener('click', ()=> openModal('loginModal'));
    bookNow && bookNow.addEventListener('click', ()=> openModal('dateModal'));
  
    // get otp
    const getOtp = document.getElementById('getOtp');
    getOtp && getOtp.addEventListener('click', ()=>{
      const phone = document.getElementById('phone').value.trim();
      // basic validation
      if (!/^\d{10}$/.test(phone)) {
        alert('Enter a valid 10 digit phone number (demo)');
        return;
      }
      closeModal(getOtp);
      openModal('otpModal');
      startTimer(30);
    });
  
    // OTP inputs auto focus
    const otpInputs = Array.from(document.querySelectorAll('.otp'));
    otpInputs.forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        if (e.inputType === 'insertText' && input.value.length === 1) {
          if (idx < otpInputs.length - 1) otpInputs[idx+1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx>0) {
          otpInputs[idx-1].focus();
        }
      });
    });
  
    // verify OTP (demo - accepts any 5 digits)
    const verifyOtp = document.getElementById('verifyOtp');
    verifyOtp && verifyOtp.addEventListener('click', ()=>{
      const code = otpInputs.map(i=>i.value).join('');
      if (!/^\d{5}$/.test(code)) {
        alert('Enter the 5 digit OTP (demo)');
        return;
      }
      // close OTP and open address modal
      document.getElementById('otpModal').setAttribute('aria-hidden','true');
      openModal('addressModal');
    });
  
    // add address
    const addAddress = document.getElementById('addAddress');
    addAddress && addAddress.addEventListener('click', ()=>{
      const city = document.getElementById('city').value;
      const addr = document.getElementById('addr').value.trim();
      const pin = document.getElementById('pincode').value.trim();
      if (!city || !addr || !/^\d{6}$/.test(pin)) {
        alert('Please fill address details (demo: pin should be 6 digits)');
        return;
      }
      document.getElementById('addressModal').setAttribute('aria-hidden','true');
      openModal('dateModal');
    });
  
    // continue to cart from date modal -> simulate payment success
    const continueCart = document.getElementById('continueCart');
    continueCart && continueCart.addEventListener('click', ()=>{
      document.getElementById('dateModal').setAttribute('aria-hidden','true');
      // small delay to simulate flow
      setTimeout(()=> openModal('successModal'), 400);
    });
  
    // done
    const doneBtn = document.getElementById('doneBtn');
    doneBtn && doneBtn.addEventListener('click', ()=>{
      document.getElementById('successModal').setAttribute('aria-hidden','true');
      alert('Booking complete! (demo)'); // replace with real redirect or refresh
    });
  
    // utility: timer for OTP resend
    let timerInterval = null;
    function startTimer(seconds) {
      const el = document.getElementById('otpTimer');
      clearInterval(timerInterval);
      let t = seconds;
      el.textContent = formatTime(t);
      timerInterval = setInterval(()=>{
        t--;
        el.textContent = formatTime(t);
        if (t <= 0) {
          clearInterval(timerInterval);
          document.getElementById('resendOtp').textContent = 'Resend OTP';
        }
      },1000);
    }
    function formatTime(s) {
      if (s < 0) s = 0;
      const mm = String(Math.floor(s/60)).padStart(2,'0');
      const ss = String(s%60).padStart(2,'0');
      return `${mm}:${ss}`;
    }
  
    // resend OTP demo
    const resend = document.getElementById('resendOtp');
    resend && resend.addEventListener('click', (ev)=>{
      ev.preventDefault();
      startTimer(30);
      resend.textContent = 'Sent';
    });
  
  });

  
  // mobile-header-behavior.js
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const topNav = document.querySelector('.top-nav');
  // close menu when any nav link is clicked (so menu doesn't remain open)
  topNav?.addEventListener('click', (e) => {
    const target = e.target.closest && e.target.closest('a, button');
    if (!target) return;
    // if the clicked link is an anchor to external or booking page, close menu
    if (menuToggle && menuToggle.checked) {
      // small timeout to let the link activate before hiding (improves UX)
      setTimeout(() => { menuToggle.checked = false; }, 120);
    }
  });

  // create floating mobile CTA and append to body
  const cta = document.createElement('a');
  cta.className = 'mobile-book-cta';
  cta.href = 'booking.html';
  cta.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="filter:drop-shadow(0 6px 14px rgba(0,0,0,0.06))"><path d="M3 12h18M14 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Book Tickets</span>';
  document.body.appendChild(cta);

  // optional: hide floating CTA when keyboard is visible (mobile input focus)
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(i => {
    i.addEventListener('focus', () => { cta.style.opacity = '0'; cta.style.pointerEvents = 'none'; });
    i.addEventListener('blur', () => { cta.style.opacity = '1'; cta.style.pointerEvents = 'auto'; });
  });

  // If menu opens, slightly push CTA up so it doesn't overlap menu
  if (menuToggle) {
    menuToggle.addEventListener('change', () => {
      if (menuToggle.checked) cta.style.transform = 'translateY(-80px)';
      else cta.style.transform = 'translateY(0)';
    });
  }
});


// filters.js
document.addEventListener('DOMContentLoaded', () => {
  const filtersPanel = document.querySelector('.filters-panel');
  if (!filtersPanel) return;

  const checkboxes = Array.from(filtersPanel.querySelectorAll('input[type="checkbox"][data-filter]'));
  const eventCards = Array.from(document.querySelectorAll('.event-card'));

  // utility: determine date buckets (today/tomorrow/weekend)
  const isToday = (iso) => {
    if (!iso) return false;
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };
  const isTomorrow = (iso) => {
    if (!iso) return false;
    const d = new Date(iso);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.toDateString() === tomorrow.toDateString();
  };
  const isWeekend = (iso) => {
    if (!iso) return false;
    const d = new Date(iso);
    const day = d.getDay();
    return day === 0 || day === 6;
  };

  function gatherFilters() {
    // returns object { category: [...], date: [...], price: [...], availability: [...] }
    const result = {};
    checkboxes.forEach(cb => {
      if (!cb.checked) return;
      const key = cb.getAttribute('data-filter');
      result[key] = result[key] || [];
      result[key].push(cb.value);
    });
    return result;
  }

  function matchPrice(cardValue, priceFilters) {
    if (!priceFilters || priceFilters.length === 0) return true;
    const p = Number(cardValue || 0);
    return priceFilters.some(f => {
      if (f === 'free') return p === 0;
      if (f === '100-500') return p >= 100 && p <= 500;
      if (f === '500-2000') return p >= 500 && p <= 2000;
      if (f === '2000+') return p > 2000;
      return false;
    });
  }

  function matches(card, filters) {
    // category
    if (filters.category && filters.category.length) {
      const cat = (card.dataset.category || '').trim();
      if (!filters.category.includes(cat)) return false;
    }

    // date
    if (filters.date && filters.date.length) {
      const cardDate = card.dataset.date || '';
      const dateMatches = filters.date.some(df => {
        if (df === 'today') return isToday(cardDate);
        if (df === 'tomorrow') return isTomorrow(cardDate);
        if (df === 'weekend') return isWeekend(cardDate);
        if (df === 'range') return true; // keep as true for now - implement datepicker later
        return false;
      });
      if (!dateMatches) return false;
    }

    // price
    if (!matchPrice(card.dataset.price, filters.price)) return false;

    // availability
    if (filters.availability && filters.availability.length) {
      const avail = card.dataset.availability || '';
      if (!filters.availability.includes(avail)) return false;
    }

    return true;
  }

  function applyFilters() {
    const filters = gatherFilters();
    eventCards.forEach(card => {
      if (matches(card, filters)) {
        card.style.display = '';
        card.classList.remove('filtered-out');
      } else {
        card.style.display = 'none';
        card.classList.add('filtered-out');
      }
    });
  }

  // attach change listeners
  checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
});
