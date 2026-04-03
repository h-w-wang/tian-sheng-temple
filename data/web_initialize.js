// 先宣告全域變數
window.appI18n = null;
window.appEventsRenderer = null;
window.appRouter = null;
window.appGallery = null;
window.appMobileMenu = null;

// 防護罩：等整個網頁的 HTML 載入完成後，才開始組裝與啟動模組！
window.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化所有的模組
    window.appI18n = new I18nManager(window.dictZH, window.dictEN);
    window.appEventsRenderer = new EventsRenderer(window.myEventsDB);
    window.appRouter = new Router();
    window.appGallery = new GalleryController();
    window.appMobileMenu = new MobileMenu();

    // 2. 監聽語言切換事件，重新渲染活動
    window.addEventListener('languageChanged', () => {
        window.appEventsRenderer.render(window.appI18n.currentLang);
    });

    // 3. 處理網址列的路由
    const urlParams = new URLSearchParams(window.location.search);
    let view = urlParams.get('view') || 'home';
    if (!window.appRouter.validViews.includes(view)) view = 'home';
    window.history.replaceState({ view: view }, '', window.location.search || window.location.pathname);
    
    // 4. 啟動所有的系統
    window.appI18n.init();
    window.appEventsRenderer.render(window.appI18n.currentLang);
    window.appRouter.renderView(view);
    
    // 5. 觸發畫廊的計算
    window.appGallery.updatePadding();
    setTimeout(() => window.appGallery.updateState(), 50);
});