class EventsRenderer {
    constructor(db) {
        this.db = db;
    }

    render(currentLang) {
        const container = document.getElementById('events-list');
        if (!container) return;

        // 取得目前的語言包，用來拿 "了解詳情" 的按鈕文字
        const currentDict = currentLang === 'zh' ? window.dictZH : window.dictEN;
        
        container.innerHTML = this.db.map(event => {
            const safeTitle = event.title[currentLang] || event.title['zh'];
            const safeDesc = event.desc[currentLang] || event.desc['zh'];
            const safeBtn = currentDict['btn_see_more'] || 'SEE MORE →';

            const isComingSoon = !event.date;
            const dateHtml = isComingSoon ? '' : `<p class="text-brand-gold font-bold tracking-widest mb-1 text-sm">${event.date}</p>`;
            
            let onClickAction = '';
            if (!isComingSoon) {
                if (event.link) onClickAction = `onclick="window.open('${event.link}', '_blank')"`;
                else if (event.targetView) onClickAction = `onclick="appRouter.switchView('${event.targetView}')"`;
            }
            
            const wrapperClass = isComingSoon ? "relative bg-black p-8 border border-white/5 transition-all duration-500 overflow-hidden" : "group relative bg-black p-8 border border-white/5 hover:bg-brand-gold cursor-pointer transition-all duration-500 overflow-hidden";
            const textWrapperClass = isComingSoon ? "flex flex-col md:flex-row justify-between items-start md:items-center w-full transition-all duration-500" : "flex flex-col md:flex-row justify-between items-start md:items-center w-full transition-all duration-500 transform group-hover:-translate-y-8 group-hover:opacity-0";
            const hoverBtnHtml = isComingSoon ? '' : `<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500"><span class="text-brand-black font-black tracking-[0.3em] text-2xl md:text-3xl">${safeBtn}</span></div>`;

            return `<div class="${wrapperClass}" ${onClickAction}><div class="${textWrapperClass}"><div>${dateHtml}<h3 class="text-xl font-black tracking-wider text-gray-200">${safeTitle}</h3></div><p class="mt-4 md:mt-0 text-gray-500 text-sm tracking-wider">${safeDesc}</p></div>${hoverBtnHtml}</div>`;
        }).join('');
    }
}