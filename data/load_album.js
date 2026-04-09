// data/load_album.js

function loadCloudinaryAlbum(tag, galleryId, viewName) {
    // 1. 叫 Router 切換房間 (這會處理歷史紀錄跟 Alt + 左鍵)
    if (window.appRouter) {
        window.appRouter.switchView(viewName);
    }

    const cloudName = 'dk0xndkvr'; 
    const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json?t=${new Date().getTime()}`;
    const gallery = document.getElementById(galleryId);

    if (!gallery) return;

    // 清空舊圖並顯示 Loading
    gallery.innerHTML = '<p class="text-brand-gold text-center w-full py-20 animate-pulse tracking-widest text-xl">LOADING...</p>';

    fetch(listUrl)
        .then(response => response.json())
        .then(data => {
            let htmlContent = '';
            data.resources.forEach(photo => {
                const imgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${photo.public_id}.webp`;
                htmlContent += `
                    <div class="break-inside-avoid rounded-xl overflow-hidden mb-4 group cursor-pointer relative bg-brand-darkgray border border-white/10 hover:border-brand-gold transition-colors duration-300">
                        <img src="${imgUrl}" loading="lazy" class="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700">
                    </div>
                `;
            });
            gallery.innerHTML = htmlContent;
        })
        .catch(err => console.error("抓圖失敗:", err));
}