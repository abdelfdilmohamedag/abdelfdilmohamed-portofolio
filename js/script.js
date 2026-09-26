// ============================================================
// الحصول على عميل Supabase
// ============================================================
const supabaseClient = window.supabaseClient;

// ============================================================
// المتغيرات العامة
// ============================================================
let currentFilter = 'تصميم جرافيك';
let visibleProjects = 6;
let reviews = [];
let selectedService = '';
let paymentMethod = 'فودافون كاش';
let registerType = 'طالب';
let regCvFile = null;
let regCvFileData = null;

// ============================================================
// تصفية المهارات المتقدمة مع عرض المزيد
// ============================================================

function initSkillFilter() {
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-pro-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentSkillFilter = this.dataset.filter;
            skillsVisible = SKILLS_PER_PAGE;

            filterAndShowSkills();
            updateShowMoreButton();
        });
    });

    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function () {
            const totalSkillsInCategory = getTotalSkillsInCategory(currentSkillFilter);

            if (skillsVisible >= totalSkillsInCategory) {
                skillsVisible = SKILLS_PER_PAGE;
                this.textContent = 'عرض المزيد +';
                this.classList.remove('showing-all');
            } else {
                skillsVisible += SKILLS_PER_PAGE;
                if (skillsVisible >= totalSkillsInCategory) {
                    this.textContent = 'إخفاء ↑';
                    this.classList.add('showing-all');
                }
            }

            filterAndShowSkills();
            updateShowMoreButton();
        });
    }
}

function getTotalSkillsInCategory(filter) {
    const skillCards = document.querySelectorAll('.skill-pro-card');
    let count = 0;
    skillCards.forEach(card => {
        const category = card.dataset.category || 'all';
        if (filter === 'all' || category === filter) {
            count++;
        }
    });
    return count;
}

function filterAndShowSkills() {
    const skillCards = document.querySelectorAll('.skill-pro-card');
    let visibleCount = 0;

    skillCards.forEach((card) => {
        const category = card.dataset.category || 'all';
        const matchesFilter = currentSkillFilter === 'all' || category === currentSkillFilter;

        if (matchesFilter) {
            if (visibleCount < skillsVisible) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        } else {
            card.style.display = 'none';
        }
    });
}

function updateShowMoreButton() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const totalSkillsInCategory = getTotalSkillsInCategory(currentSkillFilter);

    if (showMoreBtn) {
        if (totalSkillsInCategory <= SKILLS_PER_PAGE) {
            showMoreBtn.style.display = 'none';
        } else {
            showMoreBtn.style.display = 'block';
            if (skillsVisible >= totalSkillsInCategory) {
                showMoreBtn.textContent = 'إخفاء ↑';
                showMoreBtn.classList.add('showing-all');
            } else {
                showMoreBtn.textContent = 'عرض المزيد +';
                showMoreBtn.classList.remove('showing-all');
            }
        }
    }
}
// ============================================================
// قسم المهارات - النسخة المحسّنة
// ============================================================
let currentSkillFilter = 'frontend';
let skillsVisible = 3;
const SKILLS_PER_PAGE = 3;

const SKILLS_DATA = [
    { name: "HTML5 & CSS3", icon: "fab fa-html5", level: 100, color: "#e34f26", category: "frontend" },
    { name: "JavaScript (ES6+)", icon: "fab fa-js", level: 92, color: "#f7df1e", category: "frontend" },
    { name: "React.js", icon: "fab fa-react", level: 78, color: "#61dafb", category: "frontend" },
    { name: "Bootstrap", icon: "fab fa-bootstrap", level: 95, color: "#3178c6", category: "frontend" },
    { name: "Python", icon: "fab fa-python", level: 10, color: "#3776ab", category: "frontend" },
    { name: "UI/UX Design", icon: "fas fa-pencil-ruler", level: 95, color: "#a259ff", category: "design" },
    { name: "Graphic Design", icon: "fas fa-paint-brush", level: 98, color: "#45a728", category: "design" },
    { name: "Video Editing", icon: "fas fa-video", level: 95, color: "#ff6b6b", category: "design" },
    { name: "Content Creation", icon: "fas fa-pen-nib", level: 85, color: "#c98012", category: "design" },
    { name: "مطور ويب واجهه اماميه", icon: "fas fa-laptop-code", level: 90, color: "#9dd90f", category: "design" },
    { name: "AI & Machine Learning", icon: "fas fa-brain", level: 99, color: "#7c3aed", category: "ai" },
    { name: "ChatGPT & LLMs", icon: "fas fa-robot", level: 99, color: "#10b981", category: "ai" },
    { name: "Git & GitHub", icon: "fab fa-github", level: 88, color: "#970197", category: "tools" },
    { name: "VS Code", icon: "fas fa-code", level: 95, color: "#007acc", category: "tools" },
    { name: "مدير حملات اعلانيه", icon: "fas fa-bullhorn", level: 85, color: "#f24e1e", category: "tools" },
    { name: "منشئ محتوي", icon: "fas fa-pen", level: 100, color: "#4f009e", category: "tools" },
];

const CATEGORY_NAMES = {
    frontend: 'واجهات أمامية',
    design: 'تصميم وإبداع',
    ai: 'ذكاء اصطناعي',
    tools: 'أدوات'
};

function getLevelText(level) {
    if (level >= 95) return 'خبير';
    if (level >= 85) return 'متقدم';
    if (level >= 70) return 'جيد جداً';
    if (level >= 50) return 'جيد';
    return 'مبتدئ';
}

// عرض المهارات
function renderSkills() {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;

    grid.innerHTML = SKILLS_DATA.map((s, index) => {
        const categoryName = CATEGORY_NAMES[s.category] || 'عام';
        const isHidden = index >= SKILLS_PER_PAGE;

        return `
            <div class="skill-pro-card"
                 data-category="${s.category}"
                 data-index="${index}"
                 style="--skill-color: ${s.color}; --skill-color-bg: ${s.color}18; ${isHidden ? 'display: none;' : ''}">
                <div class="skill-header">
                    <div class="skill-icon-wrapper">
                        <i class="${s.icon}"></i>
                    </div>
                    <div class="skill-info">
                        <h3 class="skill-name">${s.name}</h3>
                        <span class="skill-category-badge">${categoryName}</span>
                    </div>
                    <span class="skill-percent">${s.level}%</span>
                </div>
                <div class="progress-wrapper">
                    <div class="progress-fill-skill" style="width: 0%" data-width="${s.level}%"></div>
                </div>
                <div class="skill-level-label">
                    <span class="level-text">${getLevelText(s.level)}</span>
                    <span>${s.level}%</span>
                </div>
            </div>
        `;
    }).join('');

    const frontendBtn = document.querySelector('.skill-filter-btn[data-filter="frontend"]');
    if (frontendBtn) frontendBtn.classList.add('active');

    currentSkillFilter = 'frontend';
    skillsVisible = SKILLS_PER_PAGE;

    filterAndShowSkills();
    updateSkillsShowMoreButton();
    initSkillFilter();

    setTimeout(() => {
        document.querySelectorAll('.progress-fill-skill').forEach(bar => {
            const card = bar.closest('.skill-pro-card');
            if (card && card.style.display !== 'none') {
                bar.style.width = bar.dataset.width;
            }
        });
    }, 300);
}

// تهيئة أزرار التصفية
function initSkillFilter() {
    document.querySelectorAll('.skill-filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.skill-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentSkillFilter = this.dataset.filter;
            skillsVisible = SKILLS_PER_PAGE;

            filterAndShowSkills();
            updateSkillsShowMoreButton();
        });
    });

    const showMoreBtn = document.getElementById('skillsShowMoreBtn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function () {
            const total = getTotalSkillsInCategory(currentSkillFilter);

            if (skillsVisible >= total) {
                skillsVisible = SKILLS_PER_PAGE;
            } else {
                skillsVisible += SKILLS_PER_PAGE;
            }

            filterAndShowSkills();
            updateSkillsShowMoreButton();
        });
    }
}

function getTotalSkillsInCategory(filter) {
    let count = 0;
    document.querySelectorAll('.skill-pro-card').forEach(card => {
        const category = card.dataset.category || 'all';
        if (filter === 'all' || category === filter) count++;
    });
    return count;
}

function filterAndShowSkills() {
    let visibleCount = 0;

    document.querySelectorAll('.skill-pro-card').forEach((card) => {
        const category = card.dataset.category || 'all';
        const matches = currentSkillFilter === 'all' || category === currentSkillFilter;

        if (matches) {
            if (visibleCount < skillsVisible) {
                card.style.display = 'block';
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = `skillCardIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${visibleCount * 0.05}s forwards`;
                visibleCount++;

                const bar = card.querySelector('.progress-fill-skill');
                if (bar) {
                    bar.style.width = '0%';
                    setTimeout(() => { bar.style.width = bar.dataset.width; }, 100 + visibleCount * 50);
                }
            } else {
                card.style.display = 'none';
            }
        } else {
            card.style.display = 'none';
        }
    });
}

// تحديث زر عرض المزيد (خاص بالمهارات فقط)
function updateSkillsShowMoreButton() {
    const wrapper = document.getElementById('skillsShowMoreWrapper');
    const btn = document.getElementById('skillsShowMoreBtn');
    if (!wrapper || !btn) return;

    const total = getTotalSkillsInCategory(currentSkillFilter);

    if (total <= SKILLS_PER_PAGE) {
        wrapper.style.display = 'none';
        return;
    }

    wrapper.style.display = 'block';
    const span = btn.querySelector('span');

    if (skillsVisible >= total) {
        span.textContent = 'إخفاء';
        btn.classList.add('showing-all');
    } else {
        span.textContent = `عرض المزيد (${total - skillsVisible})`;
        btn.classList.remove('showing-all');
    }
}

// عداد الإحصائيات
function initSkillCounters() {
    const statNumbers = document.querySelectorAll('.skill-stats .stat-number');
    if (!statNumbers.length) return;

    const animate = (el, target, duration = 2000) => {
        const start = performance.now();
        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + '+';
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + '+';
        };
        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(el => animate(el, parseInt(el.dataset.count) || 0));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const section = document.querySelector('.skill-stats');
    if (section) observer.observe(section);
}
// ============================================================
// دوال مساعدة
// ============================================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// ============================================================
// عرض المدونة
// ============================================================
async function fetchBlogPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    grid.innerHTML = `<div class="skeleton-card"><div class="shimmer"></div><div class="skeleton-img"></div><div class="skeleton-line w80"></div><div class="skeleton-line w60"></div><div class="skeleton-line w40"></div></div>`.repeat(2);
    try {
        const apiKey = 'AIzaSyA8eWnuvi3FHuOBsMBlCfL77f7veKfVecw';
        const blogId = '4158891149885681385';
        const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=3&fetchImages=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Blogger API error');
        const data = await res.json();
        if (!data.items || data.items.length === 0) {
            grid.innerHTML = `<div style="text-align:center;padding:2rem">لا توجد مقالات حالياً، ترقبوا الجديد!</div>`;
            return;
        }
        grid.innerHTML = data.items.map(post => {
            const thumbnail = post.images && post.images.length > 0 ? post.images[0].url : null;
            const excerpt = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'لا يوجد ملخص';
            const date = new Date(post.published).toLocaleDateString('ar-EG');
            const comments = post.replies ? post.replies.totalItems : 0;
            return `
                <div class="blog-card" data-aos="fade-up">
                    <div class="blog-img">${thumbnail ? `<img src="${thumbnail}" alt="${post.title}" loading="lazy" />` : '<i class="fas fa-image" style="font-size:3rem"></i>'}</div>
                    <div class="blog-content">
                        <div class="blog-date"><i class="fas fa-calendar"></i> ${date} ${comments > 0 ? `<span><i class="fas fa-comments"></i> ${comments}</span>` : ''}</div>
                        <h3 class="blog-title">${post.title}</h3>
                        <p class="blog-excerpt">${excerpt}</p>
                        <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="read-more">اقرأ المقال كاملاً <i class="fas fa-arrow-left"></i></a>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        grid.innerHTML = `<div style="text-align:center;padding:2rem">⚠️ تعذر تحميل المقالات. الانترنت معطل .</div>`;
    }
}

// ============================================================
// المهارات الدوارة - عرض 4 مهارات فقط
// ============================================================
function initRotatingSkills() {
    const container = document.getElementById('rotatingSkills');
    if (!container) return;

    const skillsToShow = SKILLS_DATA.slice(0, 6);

    const centerX = 280, centerY = 280;
    const orbitProfiles = [
        { radiusX: 218, radiusY: 156, speed: 1.00, phase: 0, wave: 8 },
        { radiusX: 244, radiusY: 184, speed: -0.72, phase: 24, wave: 12 },
        { radiusX: 202, radiusY: 222, speed: 0.58, phase: 48, wave: 9 },
        { radiusX: 252, radiusY: 142, speed: -0.46, phase: 72, wave: 14 }
    ];

    let angle = 0;
    const skillElements = skillsToShow.map((skill, idx) => {
        const div = document.createElement('div');
        div.className = 'rotating-skill';
        div.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px';
        div.innerHTML = `
            <div class="skill-cell" style="background:linear-gradient(135deg,${skill.color}33,${skill.color}11);border:2px solid ${skill.color};color:${skill.color}"><i class="${skill.icon}"></i></div>
            <span>${skill.name}</span>
        `;
        div.dataset.index = idx;
        container.appendChild(div);
        return div;
    });

    function updatePositions() {
        angle += 0.12;
        skillElements.forEach((el, idx) => {
            const orbit = orbitProfiles[idx % orbitProfiles.length];
            const a = (idx / skillsToShow.length) * 360 + (angle * orbit.speed) + orbit.phase;
            const rad = a * Math.PI / 180;
            const wavePhase = (angle * orbit.speed * 1.7 + orbit.phase) * Math.PI / 180;
            const waveOffset = Math.sin(wavePhase) * orbit.wave;
            const driftOffset = Math.cos(wavePhase * 0.65) * (orbit.wave * 0.45);
            const x = centerX + (orbit.radiusX + waveOffset) * Math.cos(rad) + driftOffset * Math.sin(rad);
            const y = centerY + (orbit.radiusY + waveOffset) * Math.sin(rad) + driftOffset * Math.cos(rad);
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            const depth = Math.max(0, Math.min(1, (y - (centerY - orbit.radiusY)) / (orbit.radiusY * 2)));
            const scale = 0.88 + (depth * 0.16);
            el.style.transform = `translate(-50%, -50%) scale(${scale})`;
            el.style.opacity = 0.76 + (depth * 0.24);
            el.style.zIndex = Math.round(2 + depth * 4);
        });
        requestAnimationFrame(updatePositions);
    }
    updatePositions();
}

// ============================================================
// الكتابة التلقائية
// ============================================================
function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;
    
    const phrases = [
        "مطور ويب Front-End",
        "مصمم جرافيك",
        "خبير مونتاج فيديو",
        "متخصص ذكاء اصطناعي",
        "مدير حملات اعلانية",
        "مدير سوشيال ميديا",
        "مقدم حلول ابتكاريه لمشروعك",
        "استشاري",
    ];
    
    let idx = 0, charIdx = 0, isDeleting = false;
    let timeoutId = null;
    
    function type() {
        const current = phrases[idx];
        
        if (isDeleting) {
            if (charIdx > 0) {
                charIdx--;
                el.innerHTML = current.substring(0, charIdx) + '<span class="cursor">|</span>';
                timeoutId = setTimeout(type, 40);
            } else {
                isDeleting = false;
                idx = (idx + 1) % phrases.length;
                timeoutId = setTimeout(type, 300);
            }
        } else {
            if (charIdx < current.length) {
                charIdx++;
                el.innerHTML = current.substring(0, charIdx) + '<span class="cursor">|</span>';
                timeoutId = setTimeout(type, 70);
            } else {
                isDeleting = true;
                timeoutId = setTimeout(type, 2200);
            }
        }
    }
    
    type();
    
    // إيقاف عند مغادرة الصفحة (تحسين الأداء)
    window.addEventListener('beforeunload', () => {
        if (timeoutId) clearTimeout(timeoutId);
    });
}

// ============================================================
// عداد الزيارات
// ============================================================
function initVisitCounter() {
    let count = parseInt(localStorage.getItem('afm_visits') || '0') + 1;
    localStorage.setItem('afm_visits', String(count));
    const el = document.getElementById('visitCount');
    if (el) el.textContent = count;
}

// ============================================================
// شات بوت - إرسال إلى البريد الإلكتروني فقط
// ============================================================
function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const windowEl = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotClose');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const messages = document.getElementById('chatMessages');

    if (!toggle || !windowEl) return;

    let chatState = 'idle';
    let userData = { name: '', phone: '', message: '' };

    function startConversation() {
        if (chatState === 'idle') {
            setTimeout(() => {
                addMessage('👋 مرحباً بك في شات Abdel Fdil Mohamed!', 'bot');
                setTimeout(() => {
                    addMessage('📝 أرجو منك إدخال البيانات التالية:', 'bot');
                    setTimeout(() => {
                        addMessage('✏️ **يرجى كتابة اسمك الكامل:**', 'bot');
                        chatState = 'asking_name';
                    }, 600);
                }, 600);
            }, 500);
        }
    }

    toggle.addEventListener('click', () => {
        const isHidden = windowEl.style.display === 'none' || windowEl.style.display === '';
        windowEl.style.display = isHidden ? 'flex' : 'none';
        if (isHidden && (chatState === 'idle' || chatState === 'done')) {
            resetChat();
            setTimeout(startConversation, 300);
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            windowEl.style.display = 'none';
        });
    }

    function resetChat() {
        chatState = 'idle';
        userData = { name: '', phone: '', message: '' };
        if (messages) {
            messages.innerHTML = `
                <div class="chat-message bot">
                    <div class="chat-bubble">👋 مرحباً! أنا مساعدك الذكي.</div>
                </div>
            `;
        }
    }

    function addMessage(text, sender) {
        if (!messages) return;
        const div = document.createElement('div');
        div.className = `chat-message ${sender}`;
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        div.innerHTML = `<div class="chat-bubble">${formattedText}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        hideTyping();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-indicator-container';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="chat-bubble typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    function sendToEmail(name, phone, message) {
    // إعداد البيانات المرسلة إلى EmailJS
    const templateParams = {
        from_name: name,
        from_phone: phone,
        message: message,
        to_email: 'abdelfdilmohamed@gmail.com',
        date: new Date().toLocaleString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG')
    };

    // الإرسال التلقائي عبر EmailJS
    emailjs.send('service_px38t6e', 'template_26ll7mc', templateParams)
        .then(function(response) {
            console.log('✅ تم إرسال البريد الإلكتروني بنجاح!', response.status, response.text);
        })
        .catch(function(error) {
            console.error('❌ فشل إرسال البريد الإلكتروني:', error);
        });
}

    function handleUserMessage(text) {
        const trimmed = text.trim();

        switch (chatState) {
            case 'asking_name':
                if (trimmed.length < 2) {
                    addMessage('❌ يرجى إدخال اسم صحيح (على الأقل حرفين)', 'bot');
                    return;
                }
                userData.name = trimmed;
                chatState = 'asking_phone';
                addMessage(`✅ تم حفظ الاسم: **${trimmed}**`, 'bot');
                setTimeout(() => {
                    addMessage('📱 **يرجى إدخال رقم التواصل واتساب(11 رقم):**', 'bot');
                }, 500);
                break;

            case 'asking_phone':
                const phoneRegex = /^01[0-9]{9}$/;
                if (!phoneRegex.test(trimmed)) {
                    addMessage('❌ يرجى إدخال رقم هاتف صحيح مكون من 11 رقم (مثال: 01006153136)', 'bot');
                    return;
                }
                userData.phone = trimmed;
                chatState = 'asking_message';
                addMessage(`✅ تم حفظ الرقم: **${trimmed}**`, 'bot');
                setTimeout(() => {
                    addMessage('✍️ **الرجاء كتابة استفسارك أو طلبك:**', 'bot');
                }, 500);
                break;

            case 'asking_message':
                if (trimmed.length < 3) {
                    addMessage('❌ يرجى كتابة استفسارك بشكل أوضح (على الأقل 3 أحرف)', 'bot');
                    return;
                }
                userData.message = trimmed;
                chatState = 'done';
                addMessage(`✅ تم حفظ استفسارك: **${trimmed}**`, 'bot');

                setTimeout(() => {
                    addMessage('📧 جاري إرسال بياناتك إلى البريد الإلكتروني...', 'bot');
                    showTyping();

                    setTimeout(() => {
                        hideTyping();
                        sendToEmail(userData.name, userData.phone, userData.message);
                        addMessage('✅ **تم إرسال بياناتك إلى البريد الإلكتروني!**', 'bot');
                        addMessage('📨 سيتم التواصل معك قريباً.', 'bot');
                        addMessage('💡 يمكنك كتابة "بداية" لبدء محادثة جديدة.', 'bot');

                        setTimeout(() => {
                            chatState = 'idle';
                            userData = { name: '', phone: '', message: '' };
                        }, 3000);
                    }, 1500);
                }, 600);
                break;

            case 'done':
            case 'idle':
            default:
                const lower = trimmed.toLowerCase();
                if (lower.includes('بداية') || lower.includes('start') || lower.includes('new')) {
                    resetChat();
                    setTimeout(() => {
                        addMessage('🔄 تم بدء محادثة جديدة!', 'bot');
                        setTimeout(() => {
                            addMessage('✏️ **يرجى كتابة اسمك الكامل:**', 'bot');
                            chatState = 'asking_name';
                        }, 500);
                    }, 400);
                } else if (lower.includes('مساعدة') || lower.includes('help')) {
                    addMessage('📌 **الأوامر المتاحة:**\n- اكتب "بداية" لبدء محادثة جديدة\n- اكتب "مساعدة" لعرض هذه الرسالة', 'bot');
                } else {
                    addMessage('📝 يرجى كتابة "بداية" لبدء محادثة جديدة أو "مساعدة" لعرض الأوامر.', 'bot');
                }
                break;
        }
    }

    async function sendChat() {
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        handleUserMessage(text);
    }

    if (sendBtn) sendBtn.addEventListener('click', sendChat);
    if (input) {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') sendChat();
        });
    }
}

// ============================================================
// دوال المشاريع - مع فلتر افتراضي لتصميم جرافيك وعرض 3 مشاريع فقط
// ============================================================
let currentCategory = 'تصميم جرافيك';
const PROJECTS_PER_PAGE = 2;
let isShowingAll = false;

function filterPortfolio(category) {
    currentCategory = category;
    const cards = document.querySelectorAll('.portfolio-card');
    let totalInCategory = 0;

    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'الكل' || cardCategory === category) {
            totalInCategory++;
        }
    });

    const maxToShow = isShowingAll ? totalInCategory : Math.min(PROJECTS_PER_PAGE, totalInCategory);
    let shownCount = 0;

    const noProjectsMsg = document.getElementById('noProjectsMessage');
    if (noProjectsMsg) noProjectsMsg.remove();

    if (totalInCategory === 0) {
        cards.forEach(card => {
            card.style.display = 'none';
        });

        const portfolioGrid = document.getElementById('portfolioGrid');
        if (portfolioGrid) {
            const msgDiv = document.createElement('div');
            msgDiv.id = 'noProjectsMessage';
            msgDiv.style.cssText = `
                text-align: center;
                padding: 3rem 2rem;
                width: 100%;
                grid-column: 1 / -1;
            `;
            msgDiv.innerHTML = `
                <div style="
                    background: var(--bg-card);
                    border-radius: 32px;
                    padding: 3rem 2rem;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                    max-width: 500px;
                    margin: 0 auto;
                ">
                    <i class="fas fa-folder-open" style="font-size: 4rem; color: var(--accent); margin-bottom: 1rem; opacity: 0.6;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">لا توجد مشاريع</h3>
                    <p style="color: var(--text-secondary);">لا يوجد مشاريع في فئة "<strong>${category}</strong>" حالياً</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">يمكنك تصفح الفئات الأخرى</p>
                </div>
            `;
            portfolioGrid.appendChild(msgDiv);
        }

        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'none';
        }

        console.log(`📂 لا توجد مشاريع في فئة: ${category}`);
        return;
    }

    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'الكل' || cardCategory === category) {
            if (shownCount < maxToShow) {
                card.style.display = 'block';
                shownCount++;
            } else {
                card.style.display = 'none';
            }
        } else {
            card.style.display = 'none';
        }
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (loadMoreContainer && loadMoreBtn) {
        if (totalInCategory > PROJECTS_PER_PAGE) {
            loadMoreContainer.style.display = 'block';

            if (isShowingAll) {
                loadMoreBtn.innerHTML = `<i class="fas fa-minus"></i> عرض أقل`;
                loadMoreBtn.onclick = function () {
                    isShowingAll = false;
                    filterPortfolio(category);
                };
            } else {
                const remaining = totalInCategory - shownCount;
                loadMoreBtn.innerHTML = `<i class="fas fa-plus"></i> عرض ${remaining} مشاريع أخرى`;
                loadMoreBtn.onclick = function () {
                    isShowingAll = true;
                    filterPortfolio(category);
                };
            }
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }

    console.log(`📂 عرض ${shownCount} من ${totalInCategory} مشروع في فئة: ${category}`);
}

// تهيئة أزرار التصفية
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const category = this.dataset.category;
            isShowingAll = false;
            filterPortfolio(category);
        });
    });

    const defaultBtn = document.querySelector('.filter-btn[data-category="تصميم جرافيك"]');
    if (defaultBtn) {
        setTimeout(() => {
            defaultBtn.click();
        }, 100);
    } else {
        setTimeout(() => {
            filterPortfolio('تصميم جرافيك');
        }, 100);
    }
}

// تهيئة زر عرض المزيد
function initLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        console.log('✅ زر عرض المزيد جاهز');
    }
}

// ============================================================
// دالة initProjectCards
// ============================================================
function initProjectCards() {
    document.querySelectorAll('.portfolio-card').forEach(card => {
        if (!card.querySelector('.portfolio-share-btn')) {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'portfolio-share-btn';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            shareBtn.setAttribute('aria-label', 'مشاركة المشروع');
            shareBtn.title = 'مشاركة المشروع';
            const imgDiv = card.querySelector('.portfolio-img');
            if (imgDiv) {
                imgDiv.appendChild(shareBtn);
            }

            shareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const projectData = {
                    id: card.dataset.id || card.dataset.title?.replace(/\s+/g, '-').toLowerCase() || Date.now(),
                    title: card.dataset.title || card.querySelector('h3')?.textContent || 'مشروع',
                    desc: card.dataset.desc || card.querySelector('p')?.textContent || 'لا يوجد وصف',
                    category: card.dataset.category || card.querySelector('.portfolio-tags span')?.textContent || 'عام',
                    link: card.dataset.link || '#',
                    img: card.dataset.img || card.querySelector('.portfolio-img')?.style?.backgroundImage?.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1') || 'img/default-project.jpg'
                };
                openShareModalWithVisit(projectData);
            });
        }

        card.addEventListener('click', function(e) {
            if (e.target.closest('.portfolio-share-btn')) return;
            if (e.target.closest('a')) return;
            const projectData = {
                id: this.dataset.id || this.dataset.title?.replace(/\s+/g, '-').toLowerCase() || Date.now(),
                title: this.dataset.title || this.querySelector('h3')?.textContent || 'مشروع',
                desc: this.dataset.desc || this.querySelector('p')?.textContent || 'لا يوجد وصف',
                category: this.dataset.category || this.querySelector('.portfolio-tags span')?.textContent || 'عام',
                link: this.dataset.link || '#',
                img: this.dataset.img || this.querySelector('.portfolio-img')?.style?.backgroundImage?.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1') || 'img/default-project.jpg'
            };
            openProjectModal(projectData);
        });
    });
}

// ============================================================
// معالج زر المشاركة
// ============================================================
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.portfolio-share-btn');

    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const shareLink = this.dataset.shareLink || window.location.href;
            const shareTitle = this.dataset.shareTitle || 'مشروع';
            openShareModalWithLink(shareLink, shareTitle);
        });
    });
}

// دالة فتح مودال المشاركة مع رابط مخصص
function openShareModalWithLink(shareLink, shareTitle) {
    let overlay = document.getElementById('shareModalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'shareModalOverlay';
        overlay.className = 'share-modal-overlay';
        overlay.innerHTML = `
            <div class="share-modal" onclick="event.stopPropagation()">
                <button class="modal-close-btn" id="shareModalCloseBtn"><i class="fas fa-times"></i></button>
                <h3><i class="fas fa-share-alt"></i> مشاركة المشروع</h3>
                <div class="project-title-share" id="shareProjectTitle"></div>
                <div class="share-url-box">
                    <input type="text" id="shareUrlInput" readonly>
                    <button class="copy-btn" id="shareCopyBtn"><i class="fas fa-copy"></i> نسخ</button>
                </div>
                <div class="share-social-icons">
                    <a href="#" class="whatsapp" target="_blank" id="shareWhatsapp"><i class="fab fa-whatsapp"></i></a>
                    <a href="#" class="facebook" target="_blank" id="shareFacebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="twitter" target="_blank" id="shareTwitter"><i class="fab fa-x-twitter"></i></a>
                    <a href="#" class="linkedin" target="_blank" id="shareLinkedin"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <div class="share-visit-counter">
                    <i class="fas fa-eye"></i>
                    <span>عدد الزيارات: <strong id="shareVisitCount">0</strong></span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShareModal();
            }
        });

        document.getElementById('shareModalCloseBtn').addEventListener('click', closeShareModal);

        document.getElementById('shareCopyBtn').addEventListener('click', function() {
            const input = document.getElementById('shareUrlInput');
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value).then(() => {
                this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                this.classList.add('copied');
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> نسخ';
                    this.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                document.execCommand('copy');
                this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> نسخ';
                }, 2000);
            });
        });
    }

    const titleEl = document.getElementById('shareProjectTitle');
    const urlInput = document.getElementById('shareUrlInput');
    const visitCountEl = document.getElementById('shareVisitCount');

    titleEl.textContent = shareTitle || 'مشروع';

    const shareUrl = shareLink || window.location.href;
    urlInput.value = shareUrl;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle || 'مشروع');

    document.getElementById('shareWhatsapp').href = `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`;
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    document.getElementById('shareLinkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    const projectId = shareTitle.replace(/\s+/g, '-').toLowerCase() || Date.now();
    const visits = getProjectVisits(projectId);
    visitCountEl.textContent = visits;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeShareModal() {
    const overlay = document.getElementById('shareModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function getProjectVisits(projectId) {
    const key = 'afm_project_visits';
    let data = JSON.parse(localStorage.getItem(key) || '{}');
    return data[projectId] || 0;
}

document.addEventListener('DOMContentLoaded', function() {
    initShareButtons();
});

// ============================================================
// مودال المشاركة وعداد الزيارات
// ============================================================
function openShareModal(projectData) {
    let overlay = document.getElementById('shareModalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'shareModalOverlay';
        overlay.className = 'share-modal-overlay';
        overlay.innerHTML = `
            <div class="share-modal" onclick="event.stopPropagation()">
                <button class="modal-close-btn" id="shareModalCloseBtn"><i class="fas fa-times"></i></button>
                <h3><i class="fas fa-share-alt"></i> مشاركة المشروع</h3>
                <div class="project-title-share" id="shareProjectTitle"></div>
                <div class="share-url-box">
                    <input type="text" id="shareUrlInput" readonly>
                    <button class="copy-btn" id="shareCopyBtn"><i class="fas fa-copy"></i> نسخ</button>
                </div>
                <div class="share-social-icons">
                    <a href="#" class="whatsapp" target="_blank" id="shareWhatsapp"><i class="fab fa-whatsapp"></i></a>
                    <a href="#" class="facebook" target="_blank" id="shareFacebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="twitter" target="_blank" id="shareTwitter"><i class="fab fa-x-twitter"></i></a>
                    <a href="#" class="linkedin" target="_blank" id="shareLinkedin"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <div class="share-visit-counter">
                    <i class="fas fa-eye"></i>
                    <span>عدد الزيارات: <strong id="shareVisitCount">0</strong></span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShareModal();
            }
        });

        document.getElementById('shareModalCloseBtn').addEventListener('click', closeShareModal);

        document.getElementById('shareCopyBtn').addEventListener('click', function() {
            const input = document.getElementById('shareUrlInput');
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value).then(() => {
                this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                this.classList.add('copied');
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> نسخ';
                    this.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                document.execCommand('copy');
                this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i> نسخ';
                }, 2000);
            });
        });
    }

    const titleEl = document.getElementById('shareProjectTitle');
    const urlInput = document.getElementById('shareUrlInput');
    const visitCountEl = document.getElementById('shareVisitCount');

    titleEl.textContent = projectData.title || 'مشروع';

    const projectId = projectData.id || projectData.title?.replace(/\s+/g, '-').toLowerCase() || Date.now();
    const shareUrl = window.location.origin + window.location.pathname + '?project=' + encodeURIComponent(projectId);
    urlInput.value = shareUrl;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(projectData.title || 'مشروع');
    document.getElementById('shareWhatsapp').href = `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`;
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    document.getElementById('shareLinkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    const visits = getProjectVisits(projectId);
    visitCountEl.textContent = visits;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeShareModal() {
    const overlay = document.getElementById('shareModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function getProjectVisits(projectId) {
    const key = 'afm_project_visits';
    let data = JSON.parse(localStorage.getItem(key) || '{}');
    return data[projectId] || 0;
}

function incrementProjectVisits(projectId) {
    const key = 'afm_project_visits';
    let data = JSON.parse(localStorage.getItem(key) || '{}');
    data[projectId] = (data[projectId] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
    return data[projectId];
}

function openShareModalWithVisit(projectData) {
    const projectId = projectData.id || projectData.title?.replace(/\s+/g, '-').toLowerCase() || Date.now();
    incrementProjectVisits(projectId);
    openShareModal(projectData);
}

// ============================================================
// دالة openProjectModal
// ============================================================
function openProjectModal(projectData) {
    const modal = document.getElementById('projectModal');
    const img = document.getElementById('projectModalImage');
    const category = document.getElementById('projectModalCategory');
    const title = document.getElementById('projectModalTitle');
    const desc = document.getElementById('projectModalDesc');
    const link = document.getElementById('projectModalLink');

    if (!modal) return;
    if (img) { img.src = projectData.img || 'img/default-project.jpg'; img.alt = projectData.title || 'مشروع'; }
    if (category) category.textContent = projectData.category || 'عام';
    if (title) title.textContent = projectData.title || 'مشروع';
    if (desc) desc.textContent = projectData.desc || 'لا يوجد وصف';
    if (link) {
        link.href = projectData.link || '#';
        link.style.display = (projectData.link && projectData.link !== '#') ? 'inline-flex' : 'none';
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================================
// ====== دوال آراء العملاء مع Supabase ======
// ============================================================

// جلب الآراء من Supabase
async function loadReviewsFromSupabase() {
    try {
        if (!supabaseClient) {
            console.warn('⚠️ Supabase client not initialized');
            loadReviewsFromLocalStorage();
            return;
        }

        console.log('🔄 جلب الآراء من Supabase...');

        const { data, error } = await supabaseClient
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ خطأ في Supabase:', error);
            loadReviewsFromLocalStorage();
            return;
        }

        if (data && data.length > 0) {
            console.log(`✅ تم جلب ${data.length} رأي من Supabase`);
            reviews = data.map(r => ({
                id: r.id,
                name: r.name,
                role: r.role || 'عميل',
                text: r.text,
                stars: r.stars || 5,
                avatar: r.avatar || r.name.charAt(0),
                created_at: r.created_at
            }));
            renderReviews();
        } else {
            console.log('📦 لا توجد آراء في Supabase، نتحقق من localStorage');
            loadReviewsFromLocalStorage();
        }
    } catch (error) {
        console.error('❌ خطأ في جلب الآراء:', error);
        loadReviewsFromLocalStorage();
    }
}

// تحميل من localStorage
function loadReviewsFromLocalStorage() {
    const saved = localStorage.getItem('afm_reviews');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.length) {
                reviews = parsed;
                renderReviews();
                console.log(`📦 تم تحميل ${reviews.length} رأي من localStorage`);
            }
        } catch (e) {
            console.error('❌ خطأ في localStorage:', e);
        }
    }
}

// إضافة رأي جديد إلى Supabase
async function addReviewToSupabase(name, role, text, stars) {
    try {
        if (!supabaseClient) {
            console.warn('⚠️ Supabase client not initialized');
            saveReviewLocally(name, role, text, stars);
            return;
        }

        const newReview = {
            id: Date.now(),
            name: name,
            role: role || 'عميل',
            text: text,
            stars: stars || 5,
            avatar: name.charAt(0)
        };

        console.log('📤 إضافة رأي إلى Supabase...', newReview);

        const { data, error } = await supabaseClient
            .from('reviews')
            .insert([{
                id: newReview.id,
                name: newReview.name,
                role: newReview.role,
                text: newReview.text,
                stars: newReview.stars,
                avatar: newReview.avatar
            }])
            .select();

        if (error) {
           
            saveReviewLocally(name, role, text, stars);
            return;
        }

        

        reviews.unshift(newReview);
        renderReviews();
        localStorage.setItem('afm_reviews', JSON.stringify(reviews));
        showToast('✅ تم إضافة رأيك بنجاح!');

    } catch (error) {
        
        saveReviewLocally(name, role, text, stars);
    }
}

// ==========================================
//   عرض آراء العملاء - مع زر "عرض المزيد"
// ==========================================
const INITIAL_VISIBLE = 2;
let isExpanded = false;


function renderReviews() {
    const grid = document.getElementById('testimonialsGrid');
    const showMoreWrapper = document.getElementById('showMoreWrapper');
    if (!grid) return;

    grid.innerHTML = '';
    isExpanded = false;

    if (!reviews || reviews.length === 0) {
        showMoreWrapper.style.display = 'none';
        grid.innerHTML = `<div style="text-align:center;padding:2rem;width:100%;color:var(--text-secondary)">لا توجد آراء حالياً، كن أول من يضيف رأيه!</div>`;
        return;
    }

    if (reviews.length <= INITIAL_VISIBLE) {
        showMoreWrapper.style.display = 'none';
        reviews.forEach(r => grid.appendChild(createReviewCard(r, true)));
        if (window.AOS) AOS.refresh();
        console.log(`✅ عرض الكل: ${reviews.length} رأي (بدون زر)`);
        return;
    }

    reviews.forEach((r, index) => {
        const card = createReviewCard(r, index < INITIAL_VISIBLE);
        if (index >= INITIAL_VISIBLE) {
            card.classList.add('hidden-review');
        }
        grid.appendChild(card);
    });

    showMoreWrapper.style.display = 'block';
    updateShowMoreButton();

    if (window.AOS) AOS.refresh();
    console.log(`✅ عرض ${INITIAL_VISIBLE} من ${reviews.length} رأي — زر المزيد ظاهر`);
}

// ==========================================
//   إنشاء بطاقة رأي
// ==========================================
function createReviewCard(r, useAOS) {
    const card = document.createElement('div');
    card.className = 'testimonial-card saved-review';
    if (useAOS) card.setAttribute('data-aos', 'zoom-in');

    const stars = Array(5).fill().map((_, i) =>
        `<i class="fas fa-star" style="color:${i < r.stars ? '#fbbf24' : 'var(--border-light)'}"></i>`
    ).join('');

    card.innerHTML = `
        <div class="stars">${stars}</div>
        <p class="testimonial-text">${escapeHtml(r.text)}</p>
        <div class="client-info">
            <div class="client-avatar">${r.avatar || escapeHtml(r.name.charAt(0))}</div>
            <div>
                <div class="client-name"><i class="fas fa-user"></i> ${escapeHtml(r.name)}</div>
                <div class="client-title">${escapeHtml(r.role || "عميل")}</div>
            </div>
        </div>
    `;
    return card;
}

// ==========================================
//   تحديث نص وأيقونة الزر
// ==========================================
function updateShowMoreButton() {
    const btn = document.getElementById('showMoreBtn');
    if (!btn) return;

    const hiddenCount = reviews.length - INITIAL_VISIBLE;

    if (isExpanded) {
        btn.innerHTML = `
            <span>عرض أقل</span>
            <i class="fas fa-chevron-down"></i>
        `;
        btn.classList.add('expanded');
    } else {
        btn.innerHTML = `
            <span>عرض المزيد من الآراء (${hiddenCount})</span>
            <i class="fas fa-chevron-down"></i>
        `;
        btn.classList.remove('expanded');
    }
}

// ==========================================
//   تبديل العرض / الإخفاء
// ==========================================
function toggleShowMore() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;

    const hiddenCards = grid.querySelectorAll('.testimonial-card.hidden-review');
    const visibleExtraCards = grid.querySelectorAll('.testimonial-card.reveal-review');

    if (!isExpanded) {
        hiddenCards.forEach((card, index) => {
            card.classList.remove('hidden-review');
            card.classList.add('reveal-review');
            card.style.animationDelay = `${index * 0.06}s`;
        });
        isExpanded = true;
        console.log(`📂 تم توسيع العرض — إظهار ${hiddenCards.length} رأي إضافي`);
    } else {
        visibleExtraCards.forEach(card => {
            card.classList.remove('reveal-review');
        });

        const allCards = grid.querySelectorAll('.testimonial-card');
        allCards.forEach((card, index) => {
            if (index >= INITIAL_VISIBLE) {
                card.classList.add('hidden-review');
            }
        });
        isExpanded = false;

        const section = document.getElementById('testimonials');
        if (section) {
            const y = section.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        console.log(`📁 تم إخفاء الآراء الإضافية — عرض ${INITIAL_VISIBLE} فقط`);
    }

    updateShowMoreButton();

    if (window.AOS) setTimeout(() => AOS.refresh(), 100);
}

// ==========================================
//   ربط الأزرار
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', toggleShowMore);
    }
});

// حماية من XSS
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================================
// ====== التهيئة العامة ======
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 بدء تهيئة الموقع...');

    AOS.init({ duration: 800, once: true, easing: 'ease-out' });

    renderSkills();
    fetchBlogPosts();
    initRotatingSkills();
    initTyping();
    initVisitCounter();
    initChatbot();
    initProjectCards();
    initFilterButtons();

    loadReviewsFromSupabase();

    // القائمة المتنقلة
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileMenuClose');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    }
    if (mobileClose && mobileMenu) {
        mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('open'));
        });
    }

    // تبديل الثيم
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            document.body.classList.toggle('light');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('light')) {
                icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'light');
            } else {
                icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'dark');
            }
        });
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light');
            const icon = themeBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        }
    }

    // شريط التقدم
    const progressBar = document.getElementById('progressBar');
    const scrollFill = document.getElementById('scrollFill');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
        if (progressBar) progressBar.style.width = progress + '%';
        if (scrollFill) scrollFill.style.height = progress + '%';
        if (backToTop) backToTop.classList.toggle('show', window.scrollY > 300);
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // بقعة الضوء
    const spotlight = document.getElementById('spotlight');
    if (spotlight) {
        document.addEventListener('mousemove', function (e) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            spotlight.style.setProperty('--x', x + '%');
            spotlight.style.setProperty('--y', y + '%');
        });
    }

    // أزرار السيرة الذاتية
    const cvHeaderBtn = document.getElementById('cvHeaderBtn');
    const cvModal = document.getElementById('cvModal');
    if (cvHeaderBtn && cvModal) {
        cvHeaderBtn.addEventListener('click', () => { cvModal.style.display = 'flex'; });
    }

    // مودال طلب الخدمة
    const serviceModal = document.getElementById('serviceModal');
    const serviceSelect = document.getElementById('serviceSelect');
    if (serviceSelect) {
        document.querySelectorAll('.request-btn').forEach(btn => {
            const serviceName = btn.dataset.service;
            if (serviceName) {
                const opt = document.createElement('option');
                opt.value = serviceName;
                opt.textContent = serviceName;
                serviceSelect.appendChild(opt);
            }
        });
    }

    const requestBtn1 = document.getElementById('requestServiceBtn');
    const requestBtn2 = document.getElementById('requestServiceBtn2');
    if (requestBtn1 && serviceModal) {
        requestBtn1.addEventListener('click', () => { serviceModal.style.display = 'flex'; });
    }
    if (requestBtn2 && serviceModal) {
        requestBtn2.addEventListener('click', () => { serviceModal.style.display = 'flex'; });
    }

    const serviceNextBtn = document.getElementById('serviceNextBtn');
    if (serviceNextBtn && serviceModal) {
        serviceNextBtn.addEventListener('click', function () {
            const name = document.getElementById('serviceName')?.value?.trim() || '';
            const phone = document.getElementById('servicePhone')?.value?.trim() || '';
            if (!name || !phone || phone.length !== 11) {
                showToast('❌ الاسم ورقم الواتساب (11 رقم) مطلوبان');
                return;
            }
            selectedService = serviceSelect ? serviceSelect.value : '';
            serviceModal.style.display = 'none';
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) paymentModal.style.display = 'flex';
        });
    }

    // مودال الدفع
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function () {
            paymentMethod = this.value;
        });
    });

    const paymentConfirmBtn = document.getElementById('paymentConfirmBtn');
    if (paymentConfirmBtn) {
        paymentConfirmBtn.addEventListener('click', function () {
            const name = document.getElementById('serviceName')?.value?.trim() || '';
            const phone = document.getElementById('servicePhone')?.value?.trim() || '';
            const paymentText = paymentMethod === 'فودافون كاش' ? 'رقم فودافون كاش: 01006153136' :
                paymentMethod === 'إنستا باي' ? 'رقم إنستا باي: 01006153136' : 'الدفع نقداً عند التسليم';
            const msg = `طلب خدمة جديد:\nالاسم: ${name}\nرقم الواتساب: ${phone}\nالخدمة: ${selectedService}\nطريقة الدفع: ${paymentMethod}\n${paymentText}`;
            window.open(`https://wa.me/201006153136?text=${encodeURIComponent(msg)}`, '_blank');
            showToast('✅ تم إرسال طلبك بنجاح!');
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) paymentModal.style.display = 'none';
        });
    }

    // نموذج التواصل مع EmailJS
    (function loadEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('2DbC_yKxzyd8SOTG4');
            initForm();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = function() {
            emailjs.init('2DbC_yKxzyd8SOTG4');
            initForm();
        };
        document.head.appendChild(script);
    })();

    function initForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);

        newForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('contactName')?.value?.trim() || '';
            const email = document.getElementById('contactEmail')?.value?.trim() || '';
            const phone = document.getElementById('contactPhone')?.value?.trim() || '';
            const message = document.getElementById('contactMessage')?.value?.trim() || '';

            if (!name || !email || !phone || !message) {
                showToast('⚠️ يرجى ملء جميع الحقول');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showToast('⚠️ يرجى إدخال بريد إلكتروني صحيح');
                return;
            }

            if (!/^\d{11}$/.test(phone)) {
                showToast('⚠️ رقم الهاتف يجب أن يكون 11 رقمًا');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            submitBtn.disabled = true;

            const templateParams = {
                from_name: name,
                from_email: email,
                phone: phone,
                message: message,
                to_email: 'abdelfdilmohamed@gmail.com'
            };

            emailjs.send('service_xo1lm8o', 'template_n4qin0k', templateParams)
                .then(function(response) {
                    showToast('✅ تم إرسال رسالتك بنجاح!');
                    newForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                })
                .catch(function(error) {
                    showToast('❌ حدث خطأ: ' + (error.text || 'حاول مرة أخرى'));
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // إضافة رأي
    const addReviewBtn = document.getElementById('addReviewBtn');
    const reviewForm = document.getElementById('reviewForm');
    const cancelReviewBtn = document.getElementById('cancelReviewBtn');
    const submitReviewBtn = document.getElementById('submitReviewBtn');

    if (addReviewBtn && reviewForm) {
        addReviewBtn.addEventListener('click', function () {
            reviewForm.style.display = reviewForm.style.display === 'none' ? 'block' : 'none';
        });
    }
    if (cancelReviewBtn && reviewForm) {
        cancelReviewBtn.addEventListener('click', function () {
            reviewForm.style.display = 'none';
        });
    }

    document.querySelectorAll('#starRating .fa-star').forEach(star => {
        star.addEventListener('click', function () {
            const val = parseInt(this.dataset.star);
            document.querySelectorAll('#starRating .fa-star').forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.star) <= val);
            });
        });
    });

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', function () {
            const name = document.getElementById('reviewName')?.value?.trim() || '';
            const role = document.getElementById('reviewRole')?.value?.trim() || 'عميل';
            const text = document.getElementById('reviewText')?.value?.trim() || '';

            if (!name || !text) {
                showToast('❌ الرجاء إدخال الاسم ونص الرأي');
                return;
            }

            const stars = document.querySelectorAll('#starRating .fa-star.active').length || 5;
            addReviewToSupabase(name, role, text, stars);

            const nameInput = document.getElementById('reviewName');
            const roleInput = document.getElementById('reviewRole');
            const textInput = document.getElementById('reviewText');
            if (nameInput) nameInput.value = '';
            if (roleInput) roleInput.value = 'عميل';
            if (textInput) textInput.value = '';
            if (reviewForm) reviewForm.style.display = 'none';
        });
    }

    // إغلاق المودالات
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });

    console.log('✅ تم تهيئة الموقع بنجاح!');
});

// ============================================================
// إصلاح زر طلب خدمة في الخدمات
// ============================================================
function initServiceRequestButtons() {
    document.querySelectorAll('.request-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const serviceName = this.dataset.service;
            const serviceModal = document.getElementById('serviceModal');
            const serviceSelect = document.getElementById('serviceSelect');

            if (serviceModal && serviceSelect) {
                if (serviceName) {
                    for (let option of serviceSelect.options) {
                        if (option.value === serviceName) {
                            serviceSelect.value = serviceName;
                            break;
                        }
                    }
                }
                serviceModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// إصلاح زر تسجيل مجاني
function initRegisterButton() {
    const registerBtn = document.getElementById('registerBtn');
    const registerModal = document.getElementById('registerModal');

    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', function () {
            registerModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
}

// إصلاح زر طلب خدمة الرئيسي
function initMainServiceRequestButtons() {
    const requestBtn1 = document.getElementById('requestServiceBtn');
    const requestBtn2 = document.getElementById('requestServiceBtn2');
    const serviceModal = document.getElementById('serviceModal');

    if (requestBtn1 && serviceModal) {
        requestBtn1.addEventListener('click', function () {
            serviceModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (requestBtn2 && serviceModal) {
        requestBtn2.addEventListener('click', function () {
            serviceModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
}

initServiceRequestButtons();
initMainServiceRequestButtons();
initRegisterButton();

// ============================================================
// دالة إرسال بيانات التسجيل
// ============================================================
function sendRegistrationData(data) {
    const typeText = data.type === 'طالب' ? 'طالب جديد' : 'معلم جديد';
    const subject = encodeURIComponent(`تسجيل ${typeText} - Abdel Fdil Mohamed`);

    let body = `📝 طلب تسجيل جديد في Abdel Fdil Mohamed\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `📋 نوع التسجيل: ${data.type}\n`;
    body += `👤 الاسم الكامل: ${data.name}\n`;
    body += `🌍 الدولة: ${data.country}\n`;
    body += `📱 رقم الهاتف: ${data.phone}\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (data.type === 'طالب') {
        body += `📚 المجال المطلوب: ${data.field}\n`;
    } else {
        body += `📋 بيانات المعلم:\n`;
        body += `💼 المهنة: ${data.profession || 'غير محدد'}\n`;
        body += `⭐ الخبرة: ${data.experience || 'غير محدد'}\n`;
        body += `🏢 العمل السابق: ${data.previousWork || 'غير محدد'}\n`;
        if (data.cvLink) {
            body += `🔗 رابط السيرة الذاتية: ${data.cvLink}\n`;
        }
    }

    body += `\n📅 تاريخ التسجيل: ${new Date().toLocaleString('ar-EG')}`;

    window.location.href = `mailto:abdelfdilmohamed@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    showToast('✅ تم إرسال طلب التسجيل بنجاح!');

    document.getElementById('registerModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================================
// تهيئة قائمة الدول
// ============================================================
function initCountryLists() {
    const countries = [
        { code: '+20', name: '🇪🇬 مصر' },
        { code: '+966', name: '🇸🇦 السعودية' },
        { code: '+971', name: '🇦🇪 الإمارات' },
        { code: '+974', name: '🇶🇦 قطر' },
        { code: '+965', name: '🇰🇼 الكويت' },
        { code: '+968', name: '🇴🇲 عُمان' },
        { code: '+973', name: '🇧🇭 البحرين' },
        { code: '+962', name: '🇯🇴 الأردن' },
        { code: '+961', name: '🇱🇧 لبنان' },
        { code: '+963', name: '🇸🇾 سوريا' },
        { code: '+970', name: '🇵🇸 فلسطين' },
        { code: '+218', name: '🇱🇾 ليبيا' },
        { code: '+216', name: '🇹🇳 تونس' },
        { code: '+213', name: '🇩🇿 الجزائر' },
        { code: '+212', name: '🇲🇦 المغرب' },
        { code: '+222', name: '🇲🇷 موريتانيا' },
        { code: '+249', name: '🇸🇩 السودان' },
        { code: '+252', name: '🇸🇴 الصومال' },
        { code: '+967', name: '🇾🇪 اليمن' },
        { code: '+964', name: '🇮🇶 العراق' },
    ];

    const countrySelect = document.getElementById('regCountry');
    if (countrySelect) {
        countrySelect.innerHTML = '<option value="">-- اختر الدولة --</option>';
        countries.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            countrySelect.appendChild(opt);
        });
    }

    const phoneCountrySelect = document.getElementById('regPhoneCountry');
    if (phoneCountrySelect) {
        phoneCountrySelect.innerHTML = '';
        countries.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.code;
            opt.textContent = c.code;
            phoneCountrySelect.appendChild(opt);
        });
        phoneCountrySelect.value = '+20';
    }
}

// ============================================================
// حل مشكلة التنقل بين الطالب والمعلم في التسجيل
// ============================================================
function initRegisterTypeToggle() {
    const typeBtns = document.querySelectorAll('.type-btn');
    const regNameField = document.getElementById('regNameField');
    const regCountryField = document.getElementById('regCountryField');
    const regPhoneField = document.getElementById('regPhoneField');
    const regFieldContainer = document.getElementById('regFieldContainer');
    const regProfessionField = document.getElementById('regProfessionField');
    const regExperienceField = document.getElementById('regExperienceField');
    const regCvField = document.getElementById('regCvField');
    const regPreviousWorkField = document.getElementById('regPreviousWorkField');

    const teacherFields = [regProfessionField, regExperienceField, regCvField, regPreviousWorkField];
    const studentFields = [regFieldContainer];
    const commonFields = [regNameField, regCountryField, regPhoneField];

    function updateFields(type) {
        typeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        studentFields.forEach(field => {
            if (field) {
                field.style.display = type === 'طالب' ? 'flex' : 'none';
                field.style.flexDirection = 'column';
            }
        });

        teacherFields.forEach(field => {
            if (field) {
                field.style.display = type === 'معلم' ? 'flex' : 'none';
                field.style.flexDirection = 'column';
            }
        });

        commonFields.forEach(field => {
            if (field) {
                field.style.display = 'flex';
                field.style.flexDirection = 'column';
            }
        });

        window.registerType = type;

        document.querySelectorAll('.field-error').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('.register-field').forEach(el => {
            el.classList.remove('error');
        });
    }

    typeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            updateFields(this.dataset.type);
        });
    });

    updateFields('طالب');
}

// ============================================================
// تهيئة تقديم النموذج
// ============================================================
function initRegisterSubmit() {
    const submitBtn = document.getElementById('regSubmitBtn');

    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const type = window.registerType || 'طالب';
            const name = document.getElementById('regName')?.value?.trim() || '';
            const country = document.getElementById('regCountry')?.value || '';
            const phoneCountry = document.getElementById('regPhoneCountry')?.value || '';
            const phoneLocal = document.getElementById('regPhoneLocal')?.value?.trim() || '';

            let isValid = true;

            if (!name) {
                showFieldError('regNameError', 'الاسم مطلوب');
                document.getElementById('regNameField')?.classList.add('error');
                isValid = false;
            }

            if (!country) {
                showFieldError('regCountryError', 'الدولة مطلوبة');
                document.getElementById('regCountryField')?.classList.add('error');
                isValid = false;
            }

            if (!phoneLocal || phoneLocal.length < 8) {
                showFieldError('regPhoneError', 'رقم الهاتف مطلوب');
                document.getElementById('regPhoneField')?.classList.add('error');
                isValid = false;
            }

            if (type === 'طالب') {
                const field = document.getElementById('regField')?.value || '';
                if (!field) {
                    showFieldError('regFieldError', 'المجال مطلوب');
                    document.getElementById('regFieldContainer')?.classList.add('error');
                    isValid = false;
                }
            } else if (type === 'معلم') {
                const profession = document.getElementById('regProfession')?.value?.trim() || '';
                const experience = document.getElementById('regExperience')?.value?.trim() || '';
                const cvLink = document.getElementById('regCvLink')?.value?.trim() || '';

                if (!profession) {
                    showFieldError('regProfessionError', 'المهنة مطلوبة');
                    document.getElementById('regProfessionField')?.classList.add('error');
                    isValid = false;
                }

                if (!experience) {
                    showFieldError('regExperienceError', 'الخبرة مطلوبة');
                    document.getElementById('regExperienceField')?.classList.add('error');
                    isValid = false;
                }

                if (!cvLink) {
                    showFieldError('regCvError', 'إدخال رابط السيرة الذاتية');
                    document.getElementById('regCvField')?.classList.add('error');
                    isValid = false;
                }
            }

            if (!isValid) {
                showToast('⚠️ يرجى ملء جميع الحقول المطلوبة');
                return;
            }

            const formData = {
                type: type,
                name: name,
                country: country,
                phone: phoneCountry + phoneLocal,
                field: type === 'طالب' ? document.getElementById('regField')?.value : '',
                profession: type === 'معلم' ? document.getElementById('regProfession')?.value?.trim() : '',
                experience: type === 'معلم' ? document.getElementById('regExperience')?.value?.trim() : '',
                cvLink: type === 'معلم' ? document.getElementById('regCvLink')?.value?.trim() : '',
                previousWork: type === 'معلم' ? document.getElementById('regPreviousWork')?.value?.trim() : '',
            };

            sendRegistrationData(formData);
        });
    }
}

function showFieldError(errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = message;
    }
}

// تهيئة التسجيل
initCountryLists();
initRegisterTypeToggle();
initRegisterSubmit();

// ============================================================
// دوال مودال استكشاف الكورسات
// ============================================================
function openCoursesModal() {
    const modal = document.getElementById('coursesModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeCoursesModal() {
    const modal = document.getElementById('coursesModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function initCoursesButton() {
    const btn = document.querySelector('.platform-card .btn');
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openCoursesModal();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('coursesModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCoursesModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCoursesModal();
        }
    });
});

initCoursesButton();

// ============================================================
// تهيئة قسم About - العدّاد المتحرك
// ============================================================
function initAboutCounters() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const statNumbers = aboutSection.querySelectorAll('.about-stat-number');

    const animateNumber = (el, target, duration = 1800) => {
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);

            el.textContent = current + '+';

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + '+';
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(el => {
                    const target = parseInt(el.dataset.target) || 0;
                    animateNumber(el, target);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(aboutSection);
}

document.addEventListener('DOMContentLoaded', function () {
    initAboutCounters();
});





// اكواد الحمايه 

(function() {
    'use strict';

    // ============ 1. منع القائمة اليمنى (Right Click) ============
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // ============ 2. منع اختصارات لوحة المفاتيح الخطيرة ============
    document.addEventListener('keydown', function(e) {
        // F12 - أدوات المطور
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I / J / C - أدوات المطور
        if (e.ctrlKey && e.shiftKey && ['I','J','C','i','j','c'].includes(e.key)) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U - عرض المصدر
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S - حفظ الصفحة
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+A - تحديد الكل
        if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+P - طباعة
        if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+C - نسخ
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+K - console في Firefox
        if (e.ctrlKey && e.shiftKey && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            return false;
        }
    });

    // ============ 3. منع النسخ ============
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });

    // ============ 4. منع القص ============
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });

    // ============ 5. منع تحديد النص ============
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // ============ 6. منع سحب الصور ============
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
            e.preventDefault();
            return false;
        }
    });

    // ============ 7. منع الطباعة ============
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        document.body.innerHTML = '';
        return false;
    });

    // ============ 8. كشف أدوات المطور ============
    let devtoolsOpen = false;
    
    function detectDevTools() {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        
        if (widthDiff > threshold || heightDiff > threshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                // خيارات: حذف المحتوى، تحويل الصفحة، أو إظهار تحذير
                document.body.innerHTML = 
                    '<div style="display:flex;justify-content:center;align-items:center;' +
                    'height:100vh;font-family:sans-serif;background:#000;color:#fff;' +
                    'text-align:center;font-size:24px;">' +
                    '⚠️ تم اكتشاف أدوات المطور<br>أغلقها لإكمال التصفح</div>';
            }
        } else {
            if (devtoolsOpen) {
                devtoolsOpen = false;
                location.reload();
            }
        }
    }

    setInterval(detectDevTools, 1000);

    // ============ 9. منع تحميل الموقع في iframe ============
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // ============ 10. منع مشاهدة المصدر عبر عرض الصفحة ============
    if (window.location.protocol === 'view-source:') {
        document.documentElement.innerHTML = '';
    }

    // ============ 11. حماية ملفات JS من التحليل ============
    // إخفاء الدوال عن console
    Object.defineProperty(window, 'console', {
        get: function() {
            return {
                log: function() {},
                warn: function() {},
                error: function() {},
                info: function() {},
                debug: function() {},
                clear: function() {},
                table: function() {},
                dir: function() {}
            };
        }
    });

    // ============ 12. منع التعديل على الصفحة ============
    // يمكن تفعيلها لكنها مزعجة للمستخدم
    document.addEventListener('DOMContentLoaded', function() {
        document.body.setAttribute('oncontextmenu', 'return false');
    });

    // ============ 13. حقوق في الـ Console ============
    const style = 'color:#ff0000;font-size:24px;font-weight:bold;';
    console.log('%cتوقف!', style);
    console.log('%cهذا الموقع محمي. أي محاولة للنسخ أو السرقة تعرضك للمساءلة القانونية.', 
                'color:#ff0000;font-size:14px;');

})();

