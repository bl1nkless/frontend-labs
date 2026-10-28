// ЛР 4, варіант 6. Один скрипт для всіх сторінок: кожен блок працює, лише якщо його елементи є на сторінці.

// 1. Головна: текст, що самодрукується під назвою корпорації.
const news = document.getElementById('news');
if (news) {
    const messages = [
        'З 31.12 до 02.01 офіс працює дистанційно — святкові канікули.',
        'З 1 березня головний офіс переїжджає на вул. Інженерну, 25.',
    ];
    let m = 0, c = 0;
    setInterval(() => {
        news.textContent = messages[m].slice(0, ++c);
        if (c > messages[m].length + 30) { c = 0; m = (m + 1) % messages.length; }
    }, 80);
}

// 5. Головна: з 21:00 до 06:00 фон усіх елементів темніший на 40 % (?hour=22 — перевірка вдень).
const hour = Number(new URLSearchParams(location.search).get('hour') ?? new Date().getHours());
if (news && (hour >= 21 || hour < 6)) {
    const darken = css => css.replace(/rgba?\(([^)]+)\)/g, (color, v) => {
        const [r, g, b, a = 1] = v.split(',').map(Number);
        return `rgba(${Math.round(r * 0.6)}, ${Math.round(g * 0.6)}, ${Math.round(b * 0.6)}, ${a})`;
    });
    for (const el of document.getElementsByTagName('*')) {
        const style = getComputedStyle(el);
        el.style.backgroundColor = darken(style.backgroundColor);
        if (style.backgroundImage !== 'none') el.style.backgroundImage = darken(style.backgroundImage);
    }
}

// 2. Напрями: при наведенні на блок з data-warning з’являється попередження з підтвердженням.
const warned = document.querySelector('[data-warning]');
let confirmed = false;
warned?.addEventListener('mouseenter', () => {
    if (confirmed || document.querySelector('.modal')) return;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal-box">
        <h3>⚠ Попередження</h3>
        <p>${warned.dataset.warning}</p>
        <label><input type="checkbox"> Я ознайомився(-лася) та розумію</label>
        <button disabled>Підтвердити</button>
    </div>`;
    const box = modal.querySelector('input');
    const button = modal.querySelector('button');
    box.addEventListener('change', () => { button.disabled = !box.checked; });
    button.addEventListener('click', () => { confirmed = true; modal.remove(); });
    document.body.append(modal);
});

// 3. Напрями: фото стає фліп-картою, на звороті — перелік законів.
for (const card of document.getElementsByClassName('flip')) {
    card.onmouseenter = () => card.classList.add('flipped');
    card.onmouseleave = () => card.classList.remove('flipped');
}

// 4. Зворотній зв’язок: підсвічування поля «Детально» та підказка праворуч (обробники в атрибутах onmouseover/onmouseout).
const details = document.getElementById('details');
const tip = document.createElement('span');
tip.className = 'tip';
tip.textContent = 'Дякуючи Вам, ми стаємо кращі! Конкретизуйте мету звернення, будь ласка';
function showTip() {
    details.classList.add('hovered');
    details.after(tip);
}
function hideTip() {
    details.classList.remove('hovered');
    tip.remove();
}

const form = document.querySelector('form');
form?.addEventListener('submit', event => {
    event.preventDefault();
    alert('Дякуємо! Форму заповнено правильно (навчальна демонстрація, дані не надсилаються).');
    form.reset();
});
