// data/page_route.js

class Router {
    constructor() {
        // 🚨 修正名單：確保這裡的 ID 與 HTML 中的 view- 後綴完全一致
        this.validViews = ['home', 'album', 'history', 'gods', 'map', 'event1','god_main', 'god1', 'god2', 'god3', 'album2019', 'album2024'];
        this.currentActiveView = 'home';
        this.slides = ['hero', 'gallery', 'events', 'visit'];
        this.currentSlideIndex = 0;
        this.isAnimating = false;
        
        this.setupWheelScroll();
        this.setupPopState();
    }

    renderView(targetView) {
        // 1. 隱藏所有房間
        this.validViews.forEach(id => {
            const el = document.getElementById('view-' + id);
            if(el) el.classList.add('hide-section');
        });
        
        // 2. 顯示目標房間
        const target = document.getElementById('view-' + targetView);
        if (target) {
            target.classList.remove('hide-section');
            window.scrollTo(0, 0); 
            
            // 🚨 自動觸發抓圖：如果是相簿頁面，自動執行載入照片
            if (targetView === 'album2019') loadCloudinaryAlbum('2019_pilgrimage', 'gallery-2019');
            if (targetView === 'album2024') loadCloudinaryAlbum('2024_promotion', 'gallery-2024');
        }

        this.currentActiveView = targetView;
        if (targetView === 'home' && window.appGallery) {
            setTimeout(() => window.appGallery.updateState(), 50);
        }
    }

    switchView(targetView) {
        if (targetView === this.currentActiveView) return;

        // 修正歷史紀錄紀錄格式
        const state = { view: targetView };
        const url = targetView === 'home' ? window.location.pathname : '?view=' + targetView;
        window.history.pushState(state, '', url);
        
        this.renderView(targetView);
    }

    goBack() {
        window.history.back();
    }

    setupPopState() {
        window.addEventListener('popstate', (e) => {
            // 當按 Alt + ← 時，從 state 抓取目標 view，預設回到 home
            const targetView = (e.state && e.state.view) ? e.state.view : 'home';
            this.renderView(targetView);
        });
    }

    // goToSection 與其他滾動邏輯維持不變...
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
}