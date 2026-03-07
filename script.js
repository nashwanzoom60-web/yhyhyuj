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

// فتح استمارة الحجز من الخانات الـ 6
function openBookingBox(boxNum) {
    document.getElementById('new-name').value = '';
    document.getElementById('new-date').value = '';
    document.getElementById('new-offer').value = '';
    document.getElementById('new-total').value = '';
    document.getElementById('new-paid').value = '';
    document.getElementById('new-rest').value = '';
    document.getElementById('new-notes').value = '';
    document.getElementById('new-photographer').value = '';
    showPage('page-new-booking');
}

// حفظ حجز جديد
function saveNewBooking() {
    let name = document.getElementById('new-name').value.trim();
    if (!name) {
        alert("يرجى إدخال اسم العرسان");
        return;
    }
    
    let existingStatuses = {
        'print-flash': false,
        'receive-flash': false,
        'receive-photos': false,
        'print-photos': false
    };

    if (bookingsData[name] && bookingsData[name].statuses) {
        existingStatuses = bookingsData[name].statuses;
    }

    bookingsData[name] = {
        date: document.getElementById('new-date').value,
        offer: document.getElementById('new-offer').value,
        total: document.getElementById('new-total').value,
        paid: document.getElementById('new-paid').value,
        rest: document.getElementById('new-rest').value,
        notes: document.getElementById('new-notes').value,
        photographer: document.getElementById('new-photographer').value,
        statuses: existingStatuses
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
    document.getElementById('new-photographer').value = '';
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

// عرض قائمة الحجوزات
function showBookingsList() {
    showPage('page-bookings-list');
    renderBookings();
}

// رسم قائمة الحجوزات
function renderBookings() {
    const container = document.getElementById('bookings-list-container');
    container.innerHTML = '';
    
    let hasBookings = false;
    for (let name in bookingsData) {
        hasBookings = true;
        let b = bookingsData[name];
        let div = document.createElement('div');
        div.className = 'booking-card';
        div.innerHTML = `
            <h3 style="margin-bottom: 5px;">${name}</h3>
            <p style="margin-bottom: 10px; font-weight: bold;">التاريخ: ${b.date || 'غير محدد'}</p>
            <div class="booking-actions">
                <button class="btn-rounded" style="padding: 5px; font-size: 16px; border-width: 2px;" onclick="editBooking('${name}')">تعديل</button>
                <button class="btn-rounded" style="padding: 5px; font-size: 16px; border-width: 2px; background-color: #000; color: #fff;" onclick="deleteBooking('${name}')">حذف</button>
            </div>
        `;
        container.appendChild(div);
    }

    if (!hasBookings) {
        container.innerHTML = '<p class="text-center" style="font-weight: bold; font-size: 18px;">لا توجد حجوزات مسجلة.</p>';
    }
}

// تعديل حجز
function editBooking(name) {
    let b = bookingsData[name];
    document.getElementById('new-name').value = name;
    document.getElementById('new-date').value = b.date || '';
    document.getElementById('new-offer').value = b.offer || '';
    document.getElementById('new-total').value = b.total || '';
    document.getElementById('new-paid').value = b.paid || '';
    document.getElementById('new-rest').value = b.rest || '';
    document.getElementById('new-notes').value = b.notes || '';
    document.getElementById('new-photographer').value = b.photographer || '';
    
    showPage('page-new-booking');
}

// حذف حجز
function deleteBooking(name) {
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
        delete bookingsData[name];
        localStorage.setItem('zoomBookings', JSON.stringify(bookingsData));
        renderBookings();
    }
}
