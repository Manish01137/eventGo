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
  