document.addEventListener('DOMContentLoaded', () => {
    // بيانات شريط الصور (يمكنك استبدال الروابط بصورك المحلية مثل: "images/pic1.jpg")
    const galleryItems = [
        {
            src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
            alt: 'برمجة وتطوير',
            tag: 'برمجة وأنظمة',
            title: 'تطوير حلول ويب وتطبيقات عملية'
        },
        {
            src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80',
            alt: 'شبكات وأمن سيبراني',
            tag: 'شبكات وأمن',
            title: 'بنية تحتية وأفكار تقنية مبتكرة'
        },
        {
            src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
            alt: 'تصميم وإبداع بصري',
            tag: 'تصميم وإبداع',
            title: 'واجهات عصرية ولمسات بصرية جذابة'
        }
    ];

    const galleryTrack = document.getElementById('gallery-track');
    const gDotsContainer = document.getElementById('g-dots');
    const gPrevBtn = document.getElementById('g-prev');
    const gNextBtn = document.getElementById('g-next');

    let currentSlide = 0;
    let slideTimer = null;

    function renderGallery() {
        if (!galleryTrack || !gDotsContainer) return;

        galleryTrack.innerHTML = galleryItems.map((item) => `
            <div class="gallery-slide">
                <img src="${item.src}" alt="${item.alt}" loading="lazy">
                <div class="slide-caption">
                    <span class="caption-tag">${item.tag}</span>
                    <h3>${item.title}</h3>
                </div>
            </div>
        `).join('');

        gDotsContainer.innerHTML = galleryItems.map((_, idx) => `
            <button type="button" class="g-dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}" aria-label="صورة ${idx + 1}"></button>
        `).join('');

        document.querySelectorAll('.g-dot').forEach((dot) => {
            dot.addEventListener('click', () => {
                goToSlide(Number(dot.getAttribute('data-slide')));
                startGalleryAuto();
            });
        });

        goToSlide(0);
    }

    function goToSlide(index) {
        if (!galleryItems.length || !galleryTrack) return;
        currentSlide = (index + galleryItems.length) % galleryItems.length;
        galleryTrack.style.transform = `translateX(${currentSlide * 100}%)`;

        document.querySelectorAll('.g-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    function startGalleryAuto() {
        stopGalleryAuto();
        if (galleryItems.length > 1) {
            slideTimer = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 4000);
        }
    }

    function stopGalleryAuto() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    if (gPrevBtn) {
        gPrevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            startGalleryAuto();
        });
    }

    if (gNextBtn) {
        gNextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            startGalleryAuto();
        });
    }

    renderGallery();
    startGalleryAuto();

    // زر النبضة التفاعلية للخلفية
    const vibeBtn = document.getElementById('vibe-btn');
    if (vibeBtn) {
        vibeBtn.addEventListener('click', () => {
            document.body.classList.toggle('pulse-mode');
            goToSlide(currentSlide + 1);
        });
    }

    // القائمة المنبثقة لمعلومات المطور
    const aboutModal = document.getElementById('about-modal');
    const openAboutBtn = document.getElementById('open-about-btn');
    const closeAboutBtn = document.getElementById('close-about-btn');
    const modalGoMsgBtn = document.getElementById('modal-go-message-btn');

    function openModal() {
        if (!aboutModal) return;
        aboutModal.classList.add('open');
        aboutModal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        if (!aboutModal) return;
        aboutModal.classList.remove('open');
        aboutModal.setAttribute('aria-hidden', 'true');
    }

    if (openAboutBtn) openAboutBtn.addEventListener('click', openModal);
    if (closeAboutBtn) closeAboutBtn.addEventListener('click', closeModal);

    if (aboutModal) {
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aboutModal && aboutModal.classList.contains('open')) {
            closeModal();
        }
    });

    if (modalGoMsgBtn) {
        modalGoMsgBtn.addEventListener('click', () => {
            closeModal();
            const nameInput = document.getElementById('sender-name');
            if (nameInput && step1.classList.contains('active-section')) {
                nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => nameInput.focus(), 300);
            }
        });
    }

    // التنقل بين خطوة التسجيل وخطوة إرسال الرسالة
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const stepSuccess = document.getElementById('step-success');
    const dot2 = document.getElementById('dot-2');
    const line1 = document.getElementById('line-1');

    const registerForm = document.getElementById('register-form');
    const messageForm = document.getElementById('message-form');
    const editInfoBtn = document.getElementById('edit-info-btn');
    const sendAnotherBtn = document.getElementById('send-another-btn');

    const savedName = sessionStorage.getItem('visitor_name');
    const savedEmail = sessionStorage.getItem('visitor_email');

    if (savedName && savedEmail) {
        goToStep2(savedName, savedEmail);
    }

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sender-name').value.trim();
        const email = document.getElementById('sender-email').value.trim();

        if (!name || !email) return;

        sessionStorage.setItem('visitor_name', name);
        sessionStorage.setItem('visitor_email', email);
        goToStep2(name, email);
    });

    function goToStep2(name, email) {
        stopGalleryAuto();
        document.getElementById('display-name').textContent = name;
        document.getElementById('display-email').textContent = email;
        document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();

        document.getElementById('hidden-name').value = name;
        document.getElementById('hidden-email').value = email;
        document.getElementById('hidden-replyto').value = email;

        step1.classList.remove('active-section');
        step1.classList.add('hidden-section');

        stepSuccess.classList.remove('active-section');
        stepSuccess.classList.add('hidden-section');

        step2.classList.remove('hidden-section');
        step2.classList.add('active-section');

        dot2.classList.add('active');
        line1.classList.add('active');
    }

    editInfoBtn.addEventListener('click', () => {
        document.getElementById('sender-name').value = sessionStorage.getItem('visitor_name') || '';
        document.getElementById('sender-email').value = sessionStorage.getItem('visitor_email') || '';

        step2.classList.remove('active-section');
        step2.classList.add('hidden-section');

        step1.classList.remove('hidden-section');
        step1.classList.add('active-section');

        dot2.classList.remove('active');
        line1.classList.remove('active');
        startGalleryAuto();
    });

    // إرسال الرسالة عبر Web3Forms
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const sendBtn = document.getElementById('send-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoader = document.getElementById('btn-loader');

        const visitorName = sessionStorage.getItem('visitor_name');
        const visitorEmail = sessionStorage.getItem('visitor_email');
        const msgTitle = document.getElementById('msg-title').value.trim();

        document.getElementById('email-subject').value = `رسالة جديدة من ${visitorName} | ${msgTitle}`;

        sendBtn.disabled = true;
        btnText.textContent = 'جاري الإرسال...';
        btnLoader.style.display = 'block';

        const formData = new FormData(messageForm);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                document.getElementById('success-name').textContent = visitorName;
                document.getElementById('success-email').textContent = visitorEmail;

                step2.classList.remove('active-section');
                step2.classList.add('hidden-section');

                stepSuccess.classList.remove('hidden-section');
                stepSuccess.classList.add('active-section');

                document.getElementById('msg-title').value = '';
                document.getElementById('msg-body').value = '';
            } else {
                alert('حدث خطأ أثناء الإرسال: ' + (result.message || 'تأكد من إعدادات الإرسال'));
            }
        } catch (error) {
            alert('تعذر الاتصال بالخادم. تحقق من الإنترنت وحاول مرة أخرى.');
        } finally {
            sendBtn.disabled = false;
            btnText.textContent = 'إرسال الرسالة الآن';
            btnLoader.style.display = 'none';
        }
    });

    sendAnotherBtn.addEventListener('click', () => {
        const name = sessionStorage.getItem('visitor_name');
        const email = sessionStorage.getItem('visitor_email');
        goToStep2(name, email);
    });
});
