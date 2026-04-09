// data/page_route.js

class Router {
    constructor() {
        // 🚨 修正：加入所有正確的房間 ID 到名單中
        this.validViews = ['home', 'album', 'history', 'gods', 'map', 'event1', 'god1', 'god2', 'god3', 'album2019', 'album2024'];
        this.currentActiveView = 'home';
        this.scrollMemory = {};
        this.slides = ['hero', 'gallery', 'events', 'visit'];
        this.currentSlideIndex = 0;
        this.isAnimating = false;
        
        this.setupWheelScroll();
        this.setupPopState();
    }

    renderView(targetView) {
        // 隱藏所有房間
        this.validViews.forEach(id => {
            const el = document.getElementById('view-' + id);
            if(el) el.classList.add('hide-section');
        });
        
        // 顯示目標房間
        const target = document.getElementById('view-' + targetView);
        if (target) {
            target.classList.remove('hide-section');
            window.scrollTo(0, 0); 
        }

        this.currentActiveView = targetView;
        if (targetView === 'home' && window.appGallery) {
            setTimeout(() => window.appGallery.updateState(), 50);
        }
    }

    // 💡 關鍵：這是讓 Alt + 方向鍵生效的核心
    switchView(targetView) {
        if (targetView === this.currentActiveView) return;

        // 推送到瀏覽器歷史紀錄
        const state = { view: targetView };
        const url = targetView === 'home' ? window.location.pathname : '?view=' + targetView;
        window.history.pushState(state, '', url);
        
        this.renderView(targetView);
    }

    // 💡 讓 BACK 按鈕遵循瀏覽器歷史
    goBack() {
        window.history.back();
    }

    setupPopState() {
        // 當使用者按 Alt + ← 或瀏覽器後退時觸發
        window.addEventListener('popstate', (e) => {
            const targetView = (e.state && e.state.view) ? e.state.view : 'home';
            this.renderView(targetView);
        });
    }

    // 剩下的 goToSection, updateVerticalSlide, setupWheelScroll 維持不變...
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