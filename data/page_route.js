class Router {
    constructor() {
        this.validViews = ['home', 'album', 'history', 'gods', 'map', 'event1', 'god1', 'god2', 'god3'];
        this.scrollMemory = {};
        this.currentActiveView = 'home';
        this.slides = ['hero', 'gallery', 'events', 'visit'];
        this.currentSlideIndex = 0;
        this.isAnimating = false;
        
        // 【新增核心】：建立一個陣列當作記憶堆疊，記住你走過的每一頁
        this.historyStack = [];
        
        this.setupWheelScroll();
        this.setupPopState();
    }

    renderView(targetView) {
        const currentEl = document.getElementById('view-' + this.currentActiveView);
        if (currentEl) this.scrollMemory[this.currentActiveView] = currentEl.scrollTop;

        this.validViews.forEach(id => {
            const el = document.getElementById('view-' + id);
            if(el) el.classList.add('hide-section');
        });
        
        const target = document.getElementById('view-' + targetView);
        if (target) {
            target.classList.remove('hide-section');
            setTimeout(() => {
                const detailPages = ['event1', 'god1', 'god2', 'god3'];
                if (detailPages.includes(targetView)) target.scrollTo(0, 0); 
                else target.scrollTo({ top: this.scrollMemory[targetView] || 0, behavior: 'instant' }); 
            }, 10);
        }

        this.currentActiveView = targetView;
        if (targetView === 'home' && window.appGallery) {
            setTimeout(() => window.appGallery.updateState(), 50);
        }
    }

    switchView(targetView) {
        if (targetView === this.currentActiveView) return; // 避免同頁面重複推入
        
        // 【新增】：在前往下一頁之前，把「現在這一頁」塞進歷史紀錄堆疊裡
        this.historyStack.push(this.currentActiveView);

        if (targetView === 'home') window.history.pushState({ view: 'home' }, '', window.location.pathname);
        else window.history.pushState({ view: targetView }, '', '?view=' + targetView);
        
        this.renderView(targetView);
    }

    // 【重構】：讓它具備真正的「返回上一頁」智慧
    goBack() {
        if (this.historyStack.length > 0) {
            // 從記憶堆疊裡拿出最後走過的那一頁
            const prevView = this.historyStack.pop();
            
            // 更新網址列
            if (prevView === 'home') {
                window.history.pushState({ view: 'home' }, '', window.location.pathname);
            } else {
                window.history.pushState({ view: prevView }, '', '?view=' + prevView);
            }
            
            this.renderView(prevView);
        } else {
            // 如果沒有紀錄（例如信眾一打開網站就直接貼上子頁面網址），退無可退時才預設回首頁
            if (this.currentActiveView !== 'home') {
                window.history.pushState({ view: 'home' }, '', window.location.pathname);
                this.renderView('home');
            }
        }
    }

    goToSection(sectionId) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') && urlParams.get('view') !== 'home') {
            this.switchView('home');
        }
        setTimeout(() => {
            const targetIndex = this.slides.indexOf(sectionId);
            if(targetIndex !== -1) {
                this.currentSlideIndex = targetIndex;
                this.updateVerticalSlide();
            }
        }, 50);
    }

    updateVerticalSlide() {
        this.isAnimating = true;
        const homeWrapper = document.getElementById('home-wrapper');
        if (window.innerWidth >= 768 && homeWrapper) {
            homeWrapper.style.transform = `translateY(-${this.currentSlideIndex * 100}vh)`;
        } else {
            const section = document.getElementById(this.slides[this.currentSlideIndex]);
            if(section) section.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => { this.isAnimating = false; }, 800);
    }

    setupWheelScroll() {
        const homeView = document.getElementById('view-home');
        if (!homeView) return;
        homeView.addEventListener('wheel', (e) => {
            if (window.innerWidth < 768 || this.isAnimating) return;
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            e.preventDefault();
            if (e.deltaY > 0 && this.currentSlideIndex < this.slides.length - 1) { this.currentSlideIndex++; this.updateVerticalSlide(); }
            else if (e.deltaY < 0 && this.currentSlideIndex > 0) { this.currentSlideIndex--; this.updateVerticalSlide(); }
        }, { passive: false });
    }

    setupPopState() {
        window.addEventListener('popstate', (e) => {
            const targetView = e.state && e.state.view ? e.state.view : 'home';
            // 當信眾按「瀏覽器」的上一頁鍵時，我們也要把內部記憶拿掉最後一個，保持同步
            this.historyStack.pop();
            this.renderView(targetView);
        });
    }
}