// دالة للتنقل بين الصفحات وإخفاء الباقي
function showPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    
    // إظهار الصفحة المطلوبة
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
    
    // إغلاق القائمة الجانبية إذا كانت مفتوحة
    closeMenu();
}

// دالة لفتح وإغلاق القائمة الجانبية
function toggleMenu() {
    document.getElementById('side-menu').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('active');
}

// دالة لإغلاق القائمة الجانبية فقط
function closeMenu() {
    document.getElementById('side-menu').classList.remove('open');
    document.getElementById('menu-overlay').classList.remove('active');
}
