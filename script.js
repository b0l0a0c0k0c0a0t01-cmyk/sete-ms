document.addEventListener('DOMContentLoaded', () => {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const stepSuccess = document.getElementById('step-success');

    const dot1 = document.getElementById('dot-1');
    const dot2 = document.getElementById('dot-2');
    const line1 = document.getElementById('line-1');

    const registerForm = document.getElementById('register-form');
    const messageForm = document.getElementById('message-form');
    const editInfoBtn = document.getElementById('edit-info-btn');
    const sendAnotherBtn = document.getElementById('send-another-btn');

    // استرجاع البيانات إذا كان المستخدم قد سجلها في نفس الجلسة
    const savedName = sessionStorage.getItem('visitor_name');
    const savedEmail = sessionStorage.getItem('visitor_email');

    if (savedName && savedEmail) {
        goToStep2(savedName, savedEmail);
    }

    // الانتقال من الخطوة 1 إلى الخطوة 2
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
        document.getElementById('display-name').textContent = name;
        document.getElementById('display-email').textContent = email;
        document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();

        // تعبئة الحقول المخفية للإرسال
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

    // زر تعديل البيانات والعودة للخطوة 1
    editInfoBtn.addEventListener('click', () => {
        document.getElementById('sender-name').value = sessionStorage.getItem('visitor_name') || '';
        document.getElementById('sender-email').value = sessionStorage.getItem('visitor_email') || '';

        step2.classList.remove('active-section');
        step2.classList.add('hidden-section');

        step1.classList.remove('hidden-section');
        step1.classList.add('active-section');

        dot2.classList.remove('active');
        line1.classList.remove('active');
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

        // تخصيص عنوان الرسالة الواصلة لبريدك
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
                alert('حدث خطأ أثناء الإرسال: ' + (result.message || 'تأكد من وضع Access Key الصحيح'));
            }
        } catch (error) {
            alert('تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.');
        } finally {
            sendBtn.disabled = false;
            btnText.textContent = 'إرسال الرسالة الآن';
            btnLoader.style.display = 'none';
        }
    });

    // إرسال رسالة أخرى بنفس البيانات
    sendAnotherBtn.addEventListener('click', () => {
        const name = sessionStorage.getItem('visitor_name');
        const email = sessionStorage.getItem('visitor_email');
        goToStep2(name, email);
    });
});
