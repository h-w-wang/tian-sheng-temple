// data/load_album.js

function loadCloudinaryAlbum(tag, galleryId) {
    console.log("🚀 準備載入相簿！標籤：", tag, " / 容器 ID：", galleryId);
    
    const cloudName = 'dk0xndkvr'; 
    const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json?t=${new Date().getTime()}`;
    const gallery = document.getElementById(galleryId);

    if (!gallery) {
        console.error("❌ 慘了！找不到容器 ID：", galleryId);
        return;
    }

    // 🚨 刪除那個愚蠢的判定，強制清空並顯示 LOADING
    gallery.innerHTML = '<p class="text-brand-gold text-center w-full py-20 animate-pulse tracking-widest text-xl">照片載入中...</p>';

    fetch(listUrl)
        .then(response => {
            if (!response.ok) throw new Error(`連線異常！狀態碼：${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(`✅ 成功抓到資料！總共 ${data.resources ? data.resources.length : 0} 張照片`);
            
            let htmlContent = '';
            
            if (!data.resources || data.resources.length === 0) {
                gallery.innerHTML = '<p class="text-gray-500 text-center w-full py-20 tracking-widest">此相簿目前還沒有照片</p>';
                return;
            }

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
        .catch(err => {
            console.error("❌ 抓圖徹底失敗:", err);
            gallery.innerHTML = '<p class="text-red-500 text-center w-full py-20">載入失敗，請打開 F12 檢查錯誤訊息</p>';
        });
}