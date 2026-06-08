// Global Error Handler for debugging
window.onerror = function(message, source, lineno, colno, error) {
    alert("JavaScript 執行錯誤：\n" + message + "\n檔案：" + source + "\n行號：" + lineno + "\n堆疊：" + (error ? error.stack : ''));
    return false;
};

/**
 * Interactive Self-Introduction Presentation Engine
 * Features: Slideshow navigation, reactive editing, theme control, canvas particle system.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Default configuration data
    const DEFAULT_DATA = {
        name: "陳小明",
        title: "資深全端工程師 / 架構師",
        slogan: "「用優雅的程式碼，解決真實世界中複雜的問題。」",
        bio: "擁有 5 年以上的前後端開發經驗，專注於高效能 Web 應用程式架構、互動設計與 UI/UX 優化。熱愛開源技術，積極追求極致的使用者體驗與簡潔乾淨的代碼架構。",
        tags: "#持續學習者, #開源貢獻者, #解決問題導向, #極簡代碼主義",
        
        skillFe: "React / Vue / Next.js / TypeScript",
        skillFeVal: "95",
        skillBe: "Node.js / Go / Python / PostgreSQL",
        skillBeVal: "88",
        skillDo: "Docker / Kubernetes / AWS / CI/CD",
        skillDoVal: "80",
        skillSoft: "團隊協作 / 技術布道 / 敏捷開發",
        skillSoftVal: "90",
        
        time1Year: "2024 - 至今",
        time1Title: "資深前端工程師 @ 鈦科數碼",
        time1Desc: "主導新一代雲端管理後台的架構重建，使頁面載入速度提升 40%，並導入自動化 CI/CD 流程減少 30% 部署時間。",
        time2Year: "2021 - 2024",
        time2Title: "全端工程師 @ 創思科技",
        time2Desc: "負責高流量電商平台的後端 API 優化與微服務遷移，成功處理雙11活動期間高達 10,000+ QPS 的併發請求。",
        time3Year: "2017 - 2021",
        time3Title: "資訊工程學系 學士 @ 國立科技大學",
        time3Desc: "主修軟體工程與分散式系統，曾獲全國大專院校軟體設計競賽優等獎。",
        
        proj1Title: "AI 智慧程式碼審查助手",
        proj1Desc: "基於大語言模型的 VS Code 擴充套件，能即時自動審查代碼安全性並提出重構建議，目前已有超過 50,000+ 次下載。",
        proj2Title: "高效能 Glassmorphism UI 框架",
        proj2Desc: "使用 CSS 變數與 Web Components 開發的精美玻璃擬態 UI 組件庫，在 GitHub 上獲得 2.3k Stars，提供豐富的互動效果。",
        proj3Title: "實時協作數位白板系統",
        proj3Desc: "採用 WebSocket 與 CRDT 衝突解決演算法開發的線上協作畫布，支援百人同時在線編輯、繪圖及視訊通話。",
        
        email: "xiaoming.dev@email.com",
        github: "github.com/xiaoming-dev",
        linkedin: "linkedin.com/in/xiaoming-dev",
        blog: "blog.xiaoming.dev"
    };

    // State
    let currentSlide = 1;
    const totalSlides = 6;
    let autoplayInterval = null;
    let isPlaying = false;
    let activeTheme = 'cyberpunk';
    let appData = {};

    // DOM Elements
    const slides = document.querySelectorAll('.slide');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnPlay = document.getElementById('btn-play');
    const btnTheme = document.getElementById('btn-theme');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnPrint = document.getElementById('btn-print');
    const btnExportPptx = document.getElementById('btn-export-pptx');
    const btnHelp = document.getElementById('btn-keyboard-help');
    
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOpts = document.querySelectorAll('.theme-opt');
    const helpModal = document.getElementById('help-modal');
    const btnCloseModal = document.getElementById('close-modal-btn');
    
    const currentSlideNum = document.getElementById('current-slide-num');
    const totalSlidesNum = document.getElementById('total-slides-num');
    const slideProgressFill = document.getElementById('slide-progress-fill');
    
    const sidebar = document.getElementById('editor-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const btnReset = document.getElementById('btn-reset');
    const btnExportJson = document.getElementById('btn-export-json');

    // ==========================================================================
    // Slide Navigation Logic
    // ==========================================================================
    
    function updateSlideTracker() {
        currentSlideNum.textContent = currentSlide;
        const progressPercent = (currentSlide / totalSlides) * 100;
        slideProgressFill.style.width = `${progressPercent}%`;
    }

    function goToSlide(slideNum) {
        if (slideNum < 1 || slideNum > totalSlides) return;
        
        // Remove old animation states
        slides.forEach(slide => {
            slide.classList.remove('active', 'active-prev-out');
        });

        // Set previous slide special transition state
        if (currentSlide !== slideNum) {
            const currentActiveSlide = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
            if (currentActiveSlide && slideNum > currentSlide) {
                currentActiveSlide.classList.add('active-prev-out');
            }
        }

        currentSlide = slideNum;
        
        // Activate new slide
        const targetSlide = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
        }

        // Animate skills bars if entering slide 3
        if (currentSlide === 3) {
            setTimeout(animateSkillBars, 150);
        } else {
            resetSkillBars();
        }

        updateSlideTracker();
    }

    function nextSlide() {
        if (currentSlide < totalSlides) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(1); // loop back to first
        }
    }

    function prevSlide() {
        if (currentSlide > 1) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(totalSlides); // loop back to last
        }
    }

    // Skills Animation
    function animateSkillBars() {
        const barFe = document.getElementById('slide3-bar-fe');
        const barBe = document.getElementById('slide3-bar-be');
        const barDo = document.getElementById('slide3-bar-do');
        const barSoft = document.getElementById('slide3-bar-soft');

        if (barFe) barFe.style.width = `${appData.skillFeVal || 95}%`;
        if (barBe) barBe.style.width = `${appData.skillBeVal || 88}%`;
        if (barDo) barDo.style.width = `${appData.skillDoVal || 80}%`;
        if (barSoft) barSoft.style.width = `${appData.skillSoftVal || 90}%`;
    }

    function resetSkillBars() {
        const barFe = document.getElementById('slide3-bar-fe');
        const barBe = document.getElementById('slide3-bar-be');
        const barDo = document.getElementById('slide3-bar-do');
        const barSoft = document.getElementById('slide3-bar-soft');

        if (barFe) barFe.style.width = '0%';
        if (barBe) barBe.style.width = '0%';
        if (barDo) barDo.style.width = '0%';
        if (barSoft) barSoft.style.width = '0%';
    }

    // Autoplay Timer
    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            btnPlay.innerHTML = '<i class="fas fa-pause"></i>';
            btnPlay.setAttribute('title', '暫停播放');
            autoplayInterval = setInterval(nextSlide, 5000);
        } else {
            btnPlay.innerHTML = '<i class="fas fa-play"></i>';
            btnPlay.setAttribute('title', '自動播放');
            clearInterval(autoplayInterval);
        }
    }

    // Navigation Click Handlers
    btnPrev.addEventListener('click', () => {
        if (isPlaying) togglePlay(); // pause on manual interaction
        prevSlide();
    });

    btnNext.addEventListener('click', () => {
        if (isPlaying) togglePlay();
        nextSlide();
    });

    btnPlay.addEventListener('click', togglePlay);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Don't capture keys if typing inside input fields
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case 'PageDown':
            case ' ': // Spacebar
                e.preventDefault();
                if (isPlaying) togglePlay();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (isPlaying) togglePlay();
                prevSlide();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'Escape':
                if (helpModal.classList.contains('show')) {
                    helpModal.classList.remove('show');
                }
                break;
        }
    });

    // Swipe gestures for touch screens
    let touchStartX = 0;
    let touchEndX = 0;

    const viewport = document.getElementById('viewport');
    viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            // Swipe Left -> next
            if (isPlaying) togglePlay();
            nextSlide();
        } else if (touchEndX - touchStartX > threshold) {
            // Swipe Right -> prev
            if (isPlaying) togglePlay();
            prevSlide();
        }
    }

    // ==========================================================================
    // Fullscreen and Print Helpers
    // ==========================================================================
    
    function toggleFullscreen() {
        const docBody = document.getElementById('presentation-body');
        if (!document.fullscreenElement) {
            docBody.requestFullscreen()
                .then(() => {
                    btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
                })
                .catch(err => console.error(`Error going fullscreen: ${err.message}`));
        } else {
            document.exitFullscreen()
                .then(() => {
                    btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
                });
        }
    }

    btnFullscreen.addEventListener('click', toggleFullscreen);

    // Watch fullscreen change event (for Escape key exit tracking)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });

    btnPrint.addEventListener('click', () => {
        if (isPlaying) togglePlay();
        window.print();
    });

    if (btnExportPptx) {
        btnExportPptx.addEventListener('click', () => {
            if (isPlaying) togglePlay();
            exportToPPTX();
        });
    }

    // Keyboard Help Modal
    btnHelp.addEventListener('click', () => {
        helpModal.classList.add('show');
    });

    btnCloseModal.addEventListener('click', () => {
        helpModal.classList.remove('show');
    });

    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('show');
        }
    });

    // ==========================================================================
    // Theme Switcher Logic
    // ==========================================================================
    
    btnTheme.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        themeDropdown.classList.remove('show');
    });

    themeOpts.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedTheme = opt.getAttribute('data-theme');
            setTheme(selectedTheme);
            themeDropdown.classList.remove('show');
        });
    });

    function setTheme(themeName) {
        const docBody = document.getElementById('presentation-body');
        
        // Remove old theme classes
        docBody.classList.remove('theme-cyberpunk', 'theme-dark', 'theme-warm', 'theme-royal');
        
        // Add new class
        docBody.classList.add(`theme-${themeName}`);
        activeTheme = themeName;
        
        // Update active class in dropdown menu
        themeOpts.forEach(opt => {
            if (opt.getAttribute('data-theme') === themeName) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        // Save selection
        localStorage.setItem('presentation-theme', themeName);

        // Notify Particle Canvas to change styles
        initializeParticlesConfig();
    }

    // ==========================================================================
    // Sidebar & Editor Synchronization (Data Binding)
    // ==========================================================================
    
    // Toggle Sidebar visibility
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    sidebarClose.addEventListener('click', () => {
        sidebar.classList.add('collapsed');
    });

    // Inputs to Bind
    const inputFields = {
        name: document.getElementById('input-name'),
        title: document.getElementById('input-title'),
        slogan: document.getElementById('input-slogan'),
        bio: document.getElementById('input-bio'),
        tags: document.getElementById('input-tags'),
        
        skillFe: document.getElementById('input-skill-fe'),
        skillFeVal: document.getElementById('input-skill-fe-val'),
        skillBe: document.getElementById('input-skill-be'),
        skillBeVal: document.getElementById('input-skill-be-val'),
        skillDo: document.getElementById('input-skill-do'),
        skillDoVal: document.getElementById('input-skill-do-val'),
        skillSoft: document.getElementById('input-skill-soft'),
        skillSoftVal: document.getElementById('input-skill-soft-val'),
        
        time1Year: document.getElementById('input-time1-year'),
        time1Title: document.getElementById('input-time1-title'),
        time1Desc: document.getElementById('input-time1-desc'),
        time2Year: document.getElementById('input-time2-year'),
        time2Title: document.getElementById('input-time2-title'),
        time2Desc: document.getElementById('input-time2-desc'),
        time3Year: document.getElementById('input-time3-year'),
        time3Title: document.getElementById('input-time3-title'),
        time3Desc: document.getElementById('input-time3-desc'),
        
        proj1Title: document.getElementById('input-proj1-title'),
        proj1Desc: document.getElementById('input-proj1-desc'),
        proj2Title: document.getElementById('input-proj2-title'),
        proj2Desc: document.getElementById('input-proj2-desc'),
        proj3Title: document.getElementById('input-proj3-title'),
        proj3Desc: document.getElementById('input-proj3-desc'),
        
        email: document.getElementById('input-email'),
        github: document.getElementById('input-github'),
        linkedin: document.getElementById('input-linkedin'),
        blog: document.getElementById('input-blog')
    };

    // Populate UI view fields from data
    function syncDataToUI() {
        // Cover Slide
        document.getElementById('slide1-name').textContent = appData.name;
        document.getElementById('slide1-title').textContent = appData.title;
        document.getElementById('slide1-slogan').textContent = appData.slogan;
        
        // About Slide
        document.getElementById('slide2-name').textContent = appData.name;
        document.getElementById('slide2-title').textContent = appData.title;
        document.getElementById('slide2-bio').textContent = appData.bio;
        
        // Parse tags list
        const tagsContainer = document.getElementById('slide2-tags');
        tagsContainer.innerHTML = '';
        if (appData.tags) {
            appData.tags.split(',').forEach(tag => {
                const cleanedTag = tag.trim();
                if (cleanedTag) {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'tag';
                    tagSpan.textContent = cleanedTag.startsWith('#') ? cleanedTag : `#${cleanedTag}`;
                    tagsContainer.appendChild(tagSpan);
                }
            });
        }

        // Skills Slide Texts & Labels
        document.getElementById('slide3-skill-fe').textContent = appData.skillFe;
        document.getElementById('slide3-skill-be').textContent = appData.skillBe;
        document.getElementById('slide3-skill-do').textContent = appData.skillDo;
        document.getElementById('slide3-skill-soft').textContent = appData.skillSoft;
        
        document.getElementById('slide3-val-fe').textContent = `${appData.skillFeVal}%`;
        document.getElementById('slide3-val-be').textContent = `${appData.skillBeVal}%`;
        document.getElementById('slide3-val-do').textContent = `${appData.skillDoVal}%`;
        document.getElementById('slide3-val-soft').textContent = `${appData.skillSoftVal}%`;

        // If currently on slide 3, animate immediately
        if (currentSlide === 3) {
            animateSkillBars();
        }

        // Timeline Slide
        document.getElementById('slide4-time1-year').textContent = appData.time1Year;
        document.getElementById('slide4-time1-title').textContent = appData.time1Title;
        document.getElementById('slide4-time1-desc').textContent = appData.time1Desc;
        
        document.getElementById('slide4-time2-year').textContent = appData.time2Year;
        document.getElementById('slide4-time2-title').textContent = appData.time2Title;
        document.getElementById('slide4-time2-desc').textContent = appData.time2Desc;
        
        document.getElementById('slide4-time3-year').textContent = appData.time3Year;
        document.getElementById('slide4-time3-title').textContent = appData.time3Title;
        document.getElementById('slide4-time3-desc').textContent = appData.time3Desc;

        // Projects Slide
        document.getElementById('slide5-proj1-title').textContent = appData.proj1Title;
        document.getElementById('slide5-proj1-desc').textContent = appData.proj1Desc;
        
        document.getElementById('slide5-proj2-title').textContent = appData.proj2Title;
        document.getElementById('slide5-proj2-desc').textContent = appData.proj2Desc;
        
        document.getElementById('slide5-proj3-title').textContent = appData.proj3Title;
        document.getElementById('slide5-proj3-desc').textContent = appData.proj3Desc;

        // Contact Slide
        document.getElementById('slide6-email').textContent = appData.email;
        document.getElementById('slide6-email-link').href = `mailto:${appData.email}`;
        
        document.getElementById('slide6-github').textContent = appData.github;
        document.getElementById('slide6-github-link').href = appData.github.startsWith('http') ? appData.github : `https://${appData.github}`;
        
        document.getElementById('slide6-linkedin').textContent = appData.linkedin;
        document.getElementById('slide6-linkedin-link').href = appData.linkedin.startsWith('http') ? appData.linkedin : `https://${appData.linkedin}`;
        
        document.getElementById('slide6-blog').textContent = appData.blog;
        document.getElementById('slide6-blog-link').href = appData.blog.startsWith('http') ? appData.blog : `https://${appData.blog}`;
    }

    // Populate Sidebar Input values from data
    function syncDataToEditorInputs() {
        Object.keys(inputFields).forEach(key => {
            if (inputFields[key] && appData[key] !== undefined) {
                inputFields[key].value = appData[key];
            }
        });
    }

    // Save current active input fields back to storage
    function saveEditorInputsToData() {
        Object.keys(inputFields).forEach(key => {
            if (inputFields[key]) {
                appData[key] = inputFields[key].value;
            }
        });
        localStorage.setItem('presentation-data', JSON.stringify(appData));
        syncDataToUI();
    }

    // Setup input listeners on editor fields for reactive updates
    Object.keys(inputFields).forEach(key => {
        if (inputFields[key]) {
            inputFields[key].addEventListener('input', saveEditorInputsToData);
        }
    });

    // Reset Data button
    btnReset.addEventListener('click', () => {
        if (confirm('確定要清除所有自訂內容，重設為預設的軟體工程師自我介紹嗎？')) {
            appData = { ...DEFAULT_DATA };
            localStorage.setItem('presentation-data', JSON.stringify(appData));
            syncDataToEditorInputs();
            syncDataToUI();
        }
    });

    // Export configuration as JSON file download
    btnExportJson.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `self_intro_${appData.name.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Load initial data
    const savedData = localStorage.getItem('presentation-data');
    if (savedData) {
        try {
            appData = JSON.parse(savedData);
            // Patch missing fields from defaults in case of code updates
            Object.keys(DEFAULT_DATA).forEach(key => {
                if (appData[key] === undefined) {
                    appData[key] = DEFAULT_DATA[key];
                }
            });
        } catch(e) {
            appData = { ...DEFAULT_DATA };
        }
    } else {
        appData = { ...DEFAULT_DATA };
    }

    syncDataToEditorInputs();
    syncDataToUI();


    // ==========================================================================
    // Interactive Canvas Background Particles system
    // ==========================================================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let particleColor = '#00f2fe';
    let lineColor = 'rgba(0, 242, 254, 0.08)';
    let particleCount = 65;
    let maxDistance = 120;
    let speedMult = 0.6;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // recalculate counts based on size for performance
        if (window.innerWidth < 768) {
            particleCount = 25;
            maxDistance = 80;
        } else {
            particleCount = 70;
            maxDistance = 120;
        }
    }

    // Setup configuration based on theme
    function initializeParticlesConfig() {
        if (activeTheme === 'cyberpunk') {
            particleColor = '#00f2fe';
            lineColor = 'rgba(0, 242, 254, 0.08)';
            speedMult = 0.55;
            maxDistance = 130;
        } else if (activeTheme === 'dark') {
            particleColor = '#ff4500';
            lineColor = 'rgba(255, 69, 0, 0.04)';
            speedMult = 0.35;
            maxDistance = 100;
        } else if (activeTheme === 'warm') {
            particleColor = '#556b2f';
            lineColor = 'rgba(85, 107, 47, 0.06)';
            speedMult = 0.2;
            maxDistance = 120;
        } else if (activeTheme === 'royal') {
            particleColor = '#1b365d';
            lineColor = 'rgba(27, 54, 93, 0.05)';
            speedMult = 0.35;
            maxDistance = 120;
        }
        createParticles();
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * speedMult;
            this.speedY = (Math.random() - 0.5) * speedMult;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary collision
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
        }

        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        particlesArray = [];
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particlesArray.push(new Particle(x, y));
        }
    }

    function connectParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1 - (distance / maxDistance);
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // Initialize Canvas particle system
    resizeCanvas();
    initializeParticlesConfig();
    animateParticles();

    // ==========================================================================
    // Export presentation to PowerPoint (.pptx) file using PptxGenJS
    // ==========================================================================
    function exportToPPTX() {
        if (typeof PptxGenJS === 'undefined') {
            alert('PowerPoint 匯出套件載入中，請稍候再試！');
            return;
        }

        try {
            const pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_16x9';

            // Helper colors matching active web theme
            let bgHex = '0A0B10';
            let accentHex = '00F2FE';
            let textHex = 'F0F3FF';
            let secondaryTextHex = 'A0A5C0';
            let cardBgHex = '12131C';

            if (activeTheme === 'dark') {
                bgHex = '121212';
                accentHex = 'FF4500';
                textHex = 'FFFFFF';
                secondaryTextHex = 'B0B0B0';
                cardBgHex = '1A1A1A';
            } else if (activeTheme === 'warm') {
                bgHex = 'F6EBD9';
                accentHex = '556B2F';
                textHex = '4E3629';
                secondaryTextHex = '6E584A';
                cardBgHex = 'EBDCC3';
            } else if (activeTheme === 'royal') {
                bgHex = 'F0F4F8';
                accentHex = '1B365D';
                textHex = '1B365D';
                secondaryTextHex = '4A5D78';
                cardBgHex = 'FFFFFF';
            }

            // Slide 1: Cover
            {
                let slide = pptx.addSlide();
                slide.background = { fill: bgHex };
                
                // Welcome badge
                slide.addText("HELLO, WORLD! MY NAME IS", {
                    x: 0.8, y: 1.5, w: 8.0, h: 0.4,
                    fontSize: 14, fontFace: "Inter", color: accentHex, bold: true
                });
                
                // Name
                slide.addText(appData.name, {
                    x: 0.8, y: 1.9, w: 8.0, h: 1.0,
                    fontSize: 54, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                });
                
                // Title
                slide.addText(appData.title, {
                    x: 0.8, y: 3.0, w: 8.0, h: 0.5,
                    fontSize: 22, fontFace: "Microsoft JhengHei", color: secondaryTextHex, bold: true
                });
                
                // Slogan
                slide.addText(appData.slogan, {
                    x: 0.8, y: 3.8, w: 8.0, h: 0.8,
                    fontSize: 16, fontFace: "Microsoft JhengHei", color: secondaryTextHex, italic: true,
                    border: { type: 'line', color: accentHex, width: 2, props: { left: true } },
                    margin: [0, 0, 0, 15]
                });
            }

            // Slide 2: About Me
            {
                let slide = pptx.addSlide();
                slide.background = { fill: bgHex };
                
                // Title
                slide.addText("關於我 / About Me", {
                    x: 0.8, y: 0.5, w: 8.0, h: 0.5,
                    fontSize: 26, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                });
                
                // Avatar (using engineer_avatar.png via relative/absolute url depending on protocol)
                try {
                    const isLocalFile = window.location.protocol === 'file:';
                    if (!isLocalFile) {
                        const avatarUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/engineer_avatar.png';
                        slide.addImage({
                            path: avatarUrl,
                            x: 0.8, y: 1.4, w: 2.2, h: 2.2
                        });
                    } else {
                        // File protocol fallback
                        slide.addImage({
                            path: 'engineer_avatar.png',
                            x: 0.8, y: 1.4, w: 2.2, h: 2.2
                        });
                    }
                } catch (imgErr) {
                    console.warn("Could not load avatar image for PPTX:", imgErr);
                }
                
                // Name & Title under avatar
                slide.addText(appData.name, {
                    x: 0.8, y: 3.8, w: 2.2, h: 0.4,
                    fontSize: 18, fontFace: "Microsoft JhengHei", color: textHex, bold: true, align: 'center'
                });
                slide.addText(appData.title, {
                    x: 0.8, y: 4.2, w: 2.2, h: 0.3,
                    fontSize: 11, fontFace: "Microsoft JhengHei", color: accentHex, align: 'center'
                });
                
                // Console Box
                slide.addShape(pptx.ShapeType.rect, {
                    x: 3.6, y: 1.4, w: 5.6, h: 3.2,
                    fill: { color: cardBgHex },
                    line: { color: accentHex, width: 1 }
                });
                
                // Header text
                slide.addText("developer.json", {
                    x: 3.8, y: 1.5, w: 5.2, h: 0.3,
                    fontSize: 11, fontFace: "Fira Code", color: secondaryTextHex
                });
                
                // Bio text
                slide.addText(appData.bio, {
                    x: 3.8, y: 1.9, w: 5.2, h: 1.8,
                    fontSize: 13, fontFace: "Microsoft JhengHei", color: textHex,
                    lineSpacing: 22
                });
                
                // Tags
                let tagsCleaned = appData.tags.split(',').map(t => t.trim()).filter(t => t).join('   ');
                slide.addText(tagsCleaned, {
                    x: 3.8, y: 3.9, w: 5.2, h: 0.4,
                    fontSize: 11, fontFace: "Fira Code", color: accentHex
                });
            }

            // Slide 3: Core Skills
            {
                let slide = pptx.addSlide();
                slide.background = { fill: bgHex };
                
                // Title
                slide.addText("專業技能 / Technical Skills", {
                    x: 0.8, y: 0.5, w: 8.0, h: 0.5,
                    fontSize: 26, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                });
                
                const skills = [
                    { title: "前端開發 / Front-end", desc: appData.skillFe, val: parseInt(appData.skillFeVal) || 90, x: 0.8, y: 1.4 },
                    { title: "後端開發 / Back-end", desc: appData.skillBe, val: parseInt(appData.skillBeVal) || 85, x: 5.0, y: 1.4 },
                    { title: "雲端運維 / DevOps", desc: appData.skillDo, val: parseInt(appData.skillDoVal) || 80, x: 0.8, y: 3.1 },
                    { title: "軟實力 / Soft Skills", desc: appData.skillSoft, val: parseInt(appData.skillSoftVal) || 90, x: 5.0, y: 3.1 }
                ];
                
                skills.forEach(skill => {
                    // Card bg
                    slide.addShape(pptx.ShapeType.rect, {
                        x: skill.x, y: skill.y, w: 3.8, h: 1.4,
                        fill: { color: cardBgHex },
                        line: { color: accentHex, width: 1 }
                    });
                    
                    // Skill Title
                    slide.addText(skill.title, {
                        x: skill.x + 0.2, y: skill.y + 0.1, w: 3.4, h: 0.3,
                        fontSize: 14, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                    });
                    
                    // Description
                    slide.addText(skill.desc, {
                        x: skill.x + 0.2, y: skill.y + 0.4, w: 3.4, h: 0.4,
                        fontSize: 11, fontFace: "Fira Code", color: secondaryTextHex
                    });
                    
                    // Progress bar track
                    slide.addShape(pptx.ShapeType.rect, {
                        x: skill.x + 0.2, y: skill.y + 0.9, w: 2.8, h: 0.08,
                        fill: { color: activeTheme === 'warm' || activeTheme === 'royal' ? 'D0D0D0' : '333333' }
                    });
                    
                    // Progress bar fill
                    let fillW = 2.8 * (skill.val / 100);
                    slide.addShape(pptx.ShapeType.rect, {
                        x: skill.x + 0.2, y: skill.y + 0.9, w: fillW, h: 0.08,
                        fill: { color: accentHex }
                    });
                    
                    // Percentage text
                    slide.addText(`${skill.val}%`, {
                        x: skill.x + 3.0, y: skill.y + 0.8, w: 0.6, h: 0.3,
                        fontSize: 12, fontFace: "Fira Code", color: accentHex, bold: true, align: 'right'
                    });
                });
            }

            // Slide 4: Timeline
            {
                let slide = pptx.addSlide();
                slide.background = { fill: bgHex };
                
                // Title
                slide.addText("學經歷 / Journey", {
                    x: 0.8, y: 0.5, w: 8.0, h: 0.5,
                    fontSize: 26, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                });
                
                const timeline = [
                    { year: appData.time1Year, title: appData.time1Title, desc: appData.time1Desc, y: 1.3 },
                    { year: appData.time2Year, title: appData.time2Title, desc: appData.time2Desc, y: 2.5 },
                    { year: appData.time3Year, title: appData.time3Title, desc: appData.time3Desc, y: 3.7 }
                ];
                
                // Timeline axis line
                slide.addShape(pptx.ShapeType.rect, {
                    x: 1.0, y: 1.4, w: 0.03, h: 3.2,
                    fill: { color: accentHex }
                });
                
                timeline.forEach(item => {
                    // Marker dot
                    slide.addShape(pptx.ShapeType.ellipse, {
                        x: 0.92, y: item.y + 0.04, w: 0.18, h: 0.18,
                        fill: { color: bgHex },
                        line: { color: accentHex, width: 2 }
                    });
                    
                    // Year
                    slide.addText(item.year, {
                        x: 1.3, y: item.y, w: 2.0, h: 0.3,
                        fontSize: 12, fontFace: "Fira Code", color: accentHex, bold: true
                    });
                    
                    // Position/Title
                    slide.addText(item.title, {
                        x: 3.0, y: item.y, w: 5.8, h: 0.3,
                        fontSize: 14, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                    });
                    
                    // Description
                    slide.addText(item.desc, {
                        x: 3.0, y: item.y + 0.3, w: 5.8, h: 0.8,
                        fontSize: 11, fontFace: "Microsoft JhengHei", color: secondaryTextHex,
                        lineSpacing: 18
                    });
                });
            }

            // Slide 5: Selected Projects
            {
                let slide = pptx.addSlide();
                slide.background = { fill: bgHex };
                
                // Title
                slide.addText("代表專案 / Selected Projects", {
                    x: 0.8, y: 0.5, w: 8.0, h: 0.5,
                    fontSize: 26, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                });
                
                const projects = [
                    { num: "01", title: appData.proj1Title, desc: appData.proj1Desc, badge: "VS Code Ext", x: 0.8 },
                    { num: "02", title: appData.proj2Title, desc: appData.proj2Desc, badge: "UI Framework", x: 3.6 },
                    { num: "03", title: appData.proj3Title, desc: appData.proj3Desc, badge: "WebSocket / CRDT", x: 6.4 }
                ];
                
                projects.forEach(proj => {
                    // Card bg
                    slide.addShape(pptx.ShapeType.rect, {
                        x: proj.x, y: 1.4, w: 2.5, h: 3.4,
                        fill: { color: cardBgHex },
                        line: { color: accentHex, width: 1 }
                    });
                    
                    // Big number decoration
                    slide.addText(proj.num, {
                        x: proj.x + 1.4, y: 1.5, w: 0.9, h: 0.4,
                        fontSize: 26, fontFace: "Fira Code", color: textHex, bold: true, align: 'right', opacity: 0.15
                    });
                    
                    // Project Title
                    slide.addText(proj.title, {
                        x: proj.x + 0.2, y: 2.0, w: 2.1, h: 0.8,
                        fontSize: 14, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                    });
                    
                    // Description
                    slide.addText(proj.desc, {
                        x: proj.x + 0.2, y: 2.9, w: 2.1, h: 1.4,
                        fontSize: 11, fontFace: "Microsoft JhengHei", color: secondaryTextHex,
                        lineSpacing: 18
                    });
                    
                    // Tech tag
                    slide.addText(proj.badge, {
                        x: proj.x + 0.2, y: 4.4, w: 2.1, h: 0.3,
                        fontSize: 9, fontFace: "Fira Code", color: accentHex, align: 'left'
                    });
                });
            }

            // Slide 6: Get In Touch
            {
                let slide = pptx.addSlide();
                slide.background = { fill: bgHex };
                
                // Title
                slide.addText("聯絡我 / Get In Touch", {
                    x: 0.8, y: 0.5, w: 8.0, h: 0.5,
                    fontSize: 26, fontFace: "Microsoft JhengHei", color: textHex, bold: true
                });
                
                // Center card background
                slide.addShape(pptx.ShapeType.rect, {
                    x: 1.6, y: 1.4, w: 6.4, h: 3.4,
                    fill: { color: cardBgHex },
                    line: { color: accentHex, width: 1 }
                });
                
                // Heading CTA
                slide.addText("期待與您攜手開發，共創卓越產品", {
                    x: 1.8, y: 1.7, w: 6.0, h: 0.5,
                    fontSize: 18, fontFace: "Microsoft JhengHei", color: accentHex, bold: true, align: 'center'
                });
                
                // Details grid
                const contactItems = [
                    { label: "信箱: " + appData.email, x: 2.0, y: 2.5 },
                    { label: "GitHub: " + appData.github, x: 5.0, y: 2.5 },
                    { label: "LinkedIn: " + appData.linkedin, x: 2.0, y: 3.2 },
                    { label: "部落格: " + appData.blog, x: 5.0, y: 3.2 }
                ];
                
                contactItems.forEach(item => {
                    slide.addText(item.label, {
                        x: item.x, y: item.y, w: 2.8, h: 0.4,
                        fontSize: 11, fontFace: "Fira Code", color: textHex
                    });
                });
                
                // Thank you footer
                slide.addText("THANK YOU FOR WATCHING", {
                    x: 1.8, y: 4.1, w: 6.0, h: 0.3,
                    fontSize: 11, fontFace: "Fira Code", color: secondaryTextHex, align: 'center'
                });
            }

            // Save file
            const fileName = `自我介紹_${appData.name.replace(/\s+/g, '_')}.pptx`;
            pptx.writeFile({ fileName: fileName })
                .catch(err => {
                    console.error("PPTX save error:", err);
                    alert("PPTX 匯出失敗：" + err.message);
                });
        } catch (error) {
            console.error("PPTX generation failed:", error);
            alert("PPTX 產生時發生錯誤：" + error.message);
        }
    }

    // Load theme setting
    const savedTheme = localStorage.getItem('presentation-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('cyberpunk');
    }

    // Start on first slide
    goToSlide(1);
});
