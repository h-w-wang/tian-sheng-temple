class I18nManager {
    constructor(zh, en) {
        this.dictionaries = { zh: zh, en: en };
        this.currentLang = localStorage.getItem('temple_language') || 'zh';
    }

    init() {
        this.updateDOM();
        this.updateButtons();
    }

    toggle() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('temple_language', this.currentLang);
        this.updateDOM();
        this.updateButtons();
        
        // 廣播事件，告訴 EventsRenderer 需要重繪了
        window.dispatchEvent(new Event('languageChanged'));
    }

    updateDOM() {
        const dict = this.dictionaries[this.currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.innerHTML = dict[key];
        });
    }

    updateButtons() {
        const btnText = this.currentLang === 'zh' ? 'EN' : '繁';
        const desktopBtn = document.getElementById('lang-btn-desktop');
        const mobileBtn = document.getElementById('lang-btn-mobile');
        if (desktopBtn) { desktopBtn.innerText = btnText; desktopBtn.blur(); }
        if (mobileBtn) { mobileBtn.innerText = btnText; mobileBtn.blur(); }
    }
}