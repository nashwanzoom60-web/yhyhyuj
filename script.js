// إدارة كلمات المرور
const APP_PASSWORD = "1998";
const DELETE_PASSWORD = "1001";
let pendingDeleteAction = null; // تخزين الإجراء المراد تنفيذه بعد إدخال الرمز

// تحديد العناصر الرئيسية
const btnBrides = document.getElementById('btn-brides');
const btnDaily = document.getElementById('btn-daily');
const btnFields = document.getElementById('btn-fields');

const sectionBrides = document.getElementById('section-brides');
const sectionDaily = document.getElementById('section-daily');
const sectionFields = document.getElementById('section-fields');

const modal = document.getElementById('booking-modal');
const modalTitle = document.getElementById('modal-title');
const offerSelect = document.getElementById('offer-type');

// قواعد البيانات المحلية (في الذاكرة)
let offersList = ["نورمال", "الاول", "الثاني", "دايموند", "زوم ماكس", "زوم vip", "جلسة تصوير", "شاشة صور", "شاشة صور و طيارة"];
let bridesList = [];
let dailyBookings = {
    1: null, 2: null, 3: null, 4: null, 5: null, 6: null
};

// تهيئة النظام
window.onload = () => {
    document.getElementById('current-date-picker').valueAsDate = new Date();
    updateOffersSelect();
    renderOffersList();
};

// --- نظام الحماية ---
function checkAppLogin() {
    const input = document.getElementById('app-password').value;
    if (input === APP_PASSWORD) {
        document.getElementById('login-modal').style.display = 'none';
    } else {
        const error = document.getElementById('login-error');
        error.classList.remove('hidden');
        setTimeout(() => error.classList.add('hidden'), 2000);
    }
}

function requestDeleteAuth(actionCallback) {
    pendingDeleteAction = actionCallback;
    document.getElementById('delete-password').value = '';
    document.getElementById('delete-modal').style.display = 'flex';
}

function confirmDelete() {
    const input = document.getElementById('delete-password').value;
    if (input === DELETE_PASSWORD) {
        document.getElementById('delete-modal').style.display = 'none';
        if (pendingDeleteAction) pendingDeleteAction();
        pendingDeleteAction = null;
    } else {
        const error = document.getElementById('delete-error');
        error.classList.remove('hidden');
        setTimeout(() => error.classList.add('hidden'), 2000);
    }
}

function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    pendingDeleteAction = null;
}

// --- التنقل بين الواجهات ---
function switchTab(activeBtn, activeSection) {
    [btnBrides, btnDaily, btnFields].forEach(btn => btn.classList.remove('active'));
    [sectionBrides, sectionDaily, sectionFields].forEach(sec => sec.classList.add('hidden'));
    
    activeBtn.classList.add('active');
    activeSection.classList.remove('hidden');
}

btnBrides.addEventListener('click', () => switchTab(btnBrides, sectionBrides));
btnDaily.addEventListener('click', () => switchTab(btnDaily, sectionDaily));
btnFields.addEventListener('click', () => switchTab(btnFields, sectionFields));

// --- إدارة الحقول (العروض) ---
function updateOffersSelect() {
    offerSelect.innerHTML = '<option value="">-- اختر نوع العرض --</option>';
    offersList.forEach((offer) => {
        let option = document.createElement('option');
        option.value = offer;
        option.innerText = offer;
        offerSelect.appendChild(option);
    });
}

function renderOffersList() {
    const container = document.getElementById('offers-list');
    container.innerHTML = '';
    offersList.forEach((offer, index) => {
        const div = document.createElement('div');
        div.className = 'saved-card 3d-box';
        div.innerHTML = `
            <h4>${offer}</h4>
            <div class="card-actions">
                <button class="small-btn edit-btn 3d-btn" onclick="editOffer(${index})">تعديل</button>
                <button class="small-btn del-btn 3d-btn" onclick="requestDeleteOffer(${index})">حذف</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function addNewOffer() {
    const input = document.getElementById('new-offer-input');
    const val = input.value.trim();
    if (val) {
        offersList.push(val);
        input.value = '';
        updateOffersSelect();
        renderOffersList();
    }
}

function editOffer(index) {
    const newVal = prompt("تعديل اسم العرض:", offersList[index]);
    if (newVal && newVal.trim() !== "") {
        offersList[index] = newVal.trim();
        updateOffersSelect();
        renderOffersList();
    }
}

function requestDeleteOffer(index) {
    requestDeleteAuth(() => {
        offersList.splice(index, 1);
        updateOffersSelect();
        renderOffersList();
    });
}

// --- إدارة أسماء العرسان ---
function saveBride() {
    const data = {
        names: document.getElementById('bride-names').value,
        date: document.getElementById('bride-date').value,
        hall: document.getElementById('bride-hall').value,
        offer: document.getElementById('bride-offer').value,
        phone: document.getElementById('bride-phone').value,
        fDate: document.getElementById('bride-flash-date').value,
        print: document.getElementById('bride-print').value,
        fReceive: document.getElementById('bride-flash-receive').value,
        pReceive: document.getElementById('bride-print-receive').value
    };

    if (!data.names) return alert("يرجى إدخال أسماء العرسان على الأقل");

    bridesList.push(data);
    
    // تفريغ الحقول
    document.querySelectorAll('#bride-form input').forEach(input => input.value = '');
    
    renderBridesList();
}

function renderBridesList() {
    const container = document.getElementById('brides-list');
    container.innerHTML = '';
    bridesList.forEach((bride, index) => {
        const div = document.createElement('div');
        div.className = 'saved-card 3d-box';
        div.innerHTML = `
            <h4>${bride.names}</h4>
            <p><strong>التاريخ:</strong> ${bride.date || '---'}</p>
            <p><strong>الهاتف:</strong> ${bride.phone || '---'}</p>
            <p><strong>القاعة:</strong> ${bride.hall || '---'}</p>
            <div class="card-actions">
                <button class="small-btn del-btn 3d-btn" onclick="requestDeleteBride(${index})">حذف</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function requestDeleteBride(index) {
    requestDeleteAuth(() => {
        bridesList.splice(index, 1);
        renderBridesList();
    });
}

// --- إدارة الحجوزات (اليومية) ---
function openBookingModal(id) {
    document.getElementById('booking-id').value = id;
    const data = dailyBookings[id];
    
    const saveBtn = document.getElementById('save-booking-btn');
    const resetBtn = document.getElementById('reset-booking-btn');

    if (data) {
        // حجز موجود مسبقاً
        modalTitle.innerText = `تعديل الحجز رقم (${id})`;
        document.getElementById('book-names').value = data.names;
        document.getElementById('book-hall').value = data.hall;
        document.getElementById('book-phone').value = data.phone;
        document.getElementById('offer-type').value = data.offer;
        document.getElementById('total-amount').value = data.total;
        document.getElementById('paid-amount').value = data.paid;
        document.getElementById('book-notes').value = data.notes;
        
        saveBtn.innerText = "تعديل الحجز";
        resetBtn.classList.remove('hidden');
    } else {
        // حجز جديد فارغ
        modalTitle.innerText = `تفاصيل الحجز رقم (${id})`;
        document.getElementById('book-names').value = '';
        document.getElementById('book-hall').value = '';
        document.getElementById('book-phone').value = '';
        document.getElementById('offer-type').value = '';
        document.getElementById('total-amount').value = '';
        document.getElementById('paid-amount').value = '';
        document.getElementById('book-notes').value = '';
        
        saveBtn.innerText = "حفظ الحجز";
        resetBtn.classList.add('hidden');
    }
    
    calculateRemaining();
    modal.style.display = 'flex';
}

function saveBooking() {
    const id = document.getElementById('booking-id').value;
    const names = document.getElementById('book-names').value;
    
    if(!names) {
        alert("يرجى إدخال اسم العرسان");
        return;
    }

    dailyBookings[id] = {
        names: names,
        hall: document.getElementById('book-hall').value,
        phone: document.getElementById('book-phone').value,
        offer: document.getElementById('offer-type').value,
        total: document.getElementById('total-amount').value,
        paid: document.getElementById('paid-amount').value,
        notes: document.getElementById('book-notes').value
    };

    updateBookingCardsUI();
    closeModal();
}

function requestDeleteBooking() {
    const id = document.getElementById('booking-id').value;
    requestDeleteAuth(() => {
        dailyBookings[id] = null;
        updateBookingCardsUI();
        closeModal();
    });
}

function updateBookingCardsUI() {
    for (let i = 1; i <= 6; i++) {
        const card = document.getElementById(`card-${i}`);
        const data = dailyBookings[i];
        if (data) {
            card.classList.add('booked');
            card.innerHTML = `
                <h3>${data.names}</h3>
                <p>${data.offer || 'بدون عرض محدد'}</p>
                <p>${data.phone || 'بدون رقم'}</p>
            `;
        } else {
            card.classList.remove('booked');
            card.innerHTML = `
                <h3>حجز ${i}</h3>
                <p>اضغط لإضافة/عرض التفاصيل</p>
            `;
        }
    }
}

function closeModal() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) closeModal();
}

function calculateRemaining() {
    let total = parseFloat(document.getElementById('total-amount').value) || 0;
    let paid = parseFloat(document.getElementById('paid-amount').value) || 0;
    document.getElementById('remaining-amount').value = total - paid;
}
