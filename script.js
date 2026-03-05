// بيانات الحجوزات
let bookingsData = JSON.parse(localStorage.getItem('zoomBookings')) || {};
let currentSearchName = "";

// التنقل بين الصفحات
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
    closeMenu();
}

function toggleMenu() {
    document.getElementById('side-menu').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('active');
}

function closeMenu() {
    document.getElementById('side-menu').classList.remove('open');
    document.getElementById('menu-overlay').classList.remove('active');
}

// حفظ حجز جديد
function saveNewBooking() {
    let name = document.getElementById('new-name').value.trim();
    if (!name) {
        alert("يرجى إدخال اسم العرسان");
        return;
    }
    
    bookingsData[name] = {
        date: document.getElementById('new-date').value,
        offer: document.getElementById('new-offer').value,
        total: document.getElementById('new-total').value,
        paid: document.getElementById('new-paid').value,
        rest: document.getElementById('new-rest').value,
        notes: document.getElementById('new-notes').value,
        statuses: {
            'print-flash': false,
            'receive-flash': false,
            'receive-photos': false,
            'print-photos': false
        }
    };
    
    localStorage.setItem('zoomBookings', JSON.stringify(bookingsData));
    alert("تم حفظ الحجز بنجاح");
    
    document.getElementById('new-name').value = '';
    document.getElementById('new-date').value = '';
    document.getElementById('new-offer').value = '';
    document.getElementById('new-total').value = '';
    document.getElementById('new-paid').value = '';
    document.getElementById('new-rest').value = '';
    document.getElementById('new-notes').value = '';
}

// البحث عن حجز
function findBooking() {
    let name = document.getElementById('search-name').value.trim();
    currentSearchName = name;
    let data = bookingsData[name];
    
    if (data) {
        document.getElementById('search-date').value = data.date || '';
        document.getElementById('search-offer').value = data.offer || '';
        
        updateToggleUI('print-flash', data.statuses['print-flash']);
        updateToggleUI('receive-flash', data.statuses['receive-flash']);
        updateToggleUI('receive-photos', data.statuses['receive-photos']);
        updateToggleUI('print-photos', data.statuses['print-photos']);
    } else {
        document.getElementById('search-date').value = '';
        document.getElementById('search-offer').value = '';
        
        updateToggleUI('print-flash', false);
        updateToggleUI('receive-flash', false);
        updateToggleUI('receive-photos', false);
        updateToggleUI('print-photos', false);
    }
}

// تفعيل وإلغاء علامة الصح
function toggleCheck(statusKey) {
    if (!currentSearchName || !bookingsData[currentSearchName]) return;
    
    let isChecked = !bookingsData[currentSearchName].statuses[statusKey];
    bookingsData[currentSearchName].statuses[statusKey] = isChecked;
    
    localStorage.setItem('zoomBookings', JSON.stringify(bookingsData));
    updateToggleUI(statusKey, isChecked);
}

// تحديث شكل الزر بناءً على الحالة
function updateToggleUI(statusKey, isChecked) {
    let el = document.getElementById('toggle-' + statusKey);
    if (!el) return;
    
    if (isChecked) {
        el.classList.add('checked');
        el.querySelector('span').innerText = '✔';
    } else {
        el.classList.remove('checked');
        el.querySelector('span').innerText = '';
    }
}
