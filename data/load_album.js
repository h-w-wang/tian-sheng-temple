function loadCloudinaryAlbum(tag, galleryId) {
    const cloudName = 'dk0xndkvr'; 
    const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json?t=${new Date().getTime()}`;
    const gallery = document.getElementById(galleryId);

    // 1. 安全檢查：如果 HTML 裡沒這個箱子，直接結束，不報錯也不影響別人
    if (!gallery) return;

    gallery.innerHTML = '' ;
    // 2. 抓取雲端清單
    fetch(listUrl)
        .then(response => {
            if (!response.ok) throw new Error("Cloudinary 權限未開啟或標籤錯誤");
            return response.json();
        })
        .then(data => {
            let htmlContent = '';

            // 3. 生成照片 HTML (維持你原本要求的瀑布流格式)
            data.resources.forEach(photo => {
                const imgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${photo.public_id}.webp`;

                htmlContent += `
                    <div class="break-inside-avoid rounded-xl overflow-hidden mb-4 group cursor-pointer relative bg-brand-darkgray border border-white/10 hover:border-brand-gold transition-colors duration-300">
                        <img src="${imgUrl}" loading="lazy" class="w-full h-auto object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition duration-700">
                    </div>
                `;
            });

            // 4. 塞入箱子
            gallery.innerHTML = htmlContent;
        })
        .catch(err => console.error("相簿載入失敗:", err));
}