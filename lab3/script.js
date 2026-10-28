// ЛР 3, варіант 6. Результати виводяться на сторінку і в консоль.
function print(title, lines) {
    const text = [].concat(lines).join('\n');
    document.body.insertAdjacentHTML('beforeend', `<h2>${title}</h2><pre>${text}</pre>`);
    console.log(`${title}\n${text}`);
}

// ---------- Завдання 1. Напрями діяльності ----------
// reads1, reads2 — кількість читачів за добу 1 і добу 2; duration — тривалість послуги в місяцях.
const directions = [
    { id: 10, name: 'Енергоаудит', dept: 'Відділ енергетики', gov: 'НКРЕКП', reads1: 120, reads2: 95, duration: 6 },
    { id: 20, name: 'Сонячні станції', dept: 'Відділ енергетики', gov: 'Держенергоефективності', reads1: 210, reads2: 180, duration: 12 },
    { id: 30, name: 'Модернізація мереж', dept: 'Відділ енергетики', gov: 'Міненерго', reads1: 90, reads2: 70, duration: 18 },
    { id: 40, name: 'Резервне живлення', dept: 'Відділ енергетики', gov: 'ДСНС', reads1: 300, reads2: 260, duration: 3 },
    { id: 50, name: 'Автоматизація цехів', dept: 'Відділ промисловості', gov: 'Держпраці', reads1: 75, reads2: 64, duration: 12 },
    { id: 60, name: 'Ремонт обладнання', dept: 'Відділ промисловості', gov: 'Держпраці', reads1: 55, reads2: 41, duration: 6 },
    { id: 70, name: 'Промислова безпека', dept: 'Відділ промисловості', gov: 'Держекоінспекція', reads1: 66, reads2: 38, duration: 3 },
    { id: 80, name: 'Міське освітлення', dept: 'Відділ інфраструктури', gov: 'Міська рада', reads1: 140, reads2: 150, duration: 6 },
    { id: 90, name: 'Громадські простори', dept: 'Відділ інфраструктури', gov: 'ДІАМ', reads1: 98, reads2: 120, duration: 12 },
    { id: 100, name: 'Цифрове місто', dept: 'Відділ цифрових рішень', gov: 'Мінцифри', reads1: 160, reads2: 175, duration: 24 },
];
const row = d => `${String(d.id).padStart(3)} | ${d.name.padEnd(20)} | ${d.dept.padEnd(23)} | ${String(d.duration).padStart(2)} міс.`;

// 1.1 Сортування за тривалістю та середня кількість читачів для однакової тривалості.
const sorted = [...directions].sort((a, b) => a.duration - b.duration);
const groups = {};
for (const d of sorted) (groups[d.duration] ??= []).push(d);
const avgLines = Object.entries(groups).map(([duration, list]) => {
    const avg = list.reduce((sum, d) => sum + (d.reads1 + d.reads2) / 2, 0) / list.length;
    return `${duration} міс.: ${list.map(d => d.name).join(', ')} → ${avg.toFixed(1)} читачів за добу`;
});
print('1.1 Напрями за тривалістю послуги', [...sorted.map(row), '', ...avgLines]);

// 1.2 Напрям з мінімальною кількістю читачів за добу 2.
const least = directions.reduce((min, d) => (d.reads2 < min.reads2 ? d : min));
print('1.2 Мінімум читачів за добу 2', `${least.name} (${least.reads2}) — реалізує ${least.dept}`);

// 1.3 Додавання: неповний запис — у кінець, повний — на місце за id.
function addDirection(list, item) {
    const fields = ['id', 'name', 'dept', 'gov', 'reads1', 'reads2', 'duration'];
    const complete = fields.every(f => item[f] !== undefined && item[f] !== '');
    const index = complete ? list.findIndex(d => d.id > item.id) : -1;
    if (index === -1) list.push(item);
    else list.splice(index, 0, item);
    return complete ? `повний запис → позиція ${list.indexOf(item) + 1}` : 'неповний запис → у кінець';
}
const r1 = addDirection(directions, { id: 35, name: 'Теплові насоси', dept: 'Відділ енергетики', gov: 'Міненерго', reads1: 80, reads2: 77, duration: 9 });
const r2 = addDirection(directions, { id: 45, name: 'Аналіз даних', dept: 'Відділ аналітики', reads1: 30, duration: 4 });
print('1.3 Додавання напрямів', [`Теплові насоси (id 35): ${r1}`, `Аналіз даних (id 45): ${r2}`, '', ...directions.map(row)]);

// 1.4 Тривалість кількох послуг відділу одночасно: 1–3 послуги × 0.95, більше — × 0.6.
const serviceTime = function (dept) {
    const items = directions.filter(d => d.dept === dept && d.duration);
    const total = items.reduce((sum, d) => sum + d.duration, 0);
    let k;
    switch (items.length) {
        case 1:
        case 2:
        case 3: k = 0.95; break;
        default: k = 0.6;
    }
    return `${dept}: ${items.length} посл., ${total} міс. × ${k} = ${Math.round(total * k * 10) / 10} міс.`;
};
const depts = [...new Set(directions.map(d => d.dept))];
print('1.4 Тривалість послуг відділу одночасно', depts.map(serviceTime));

// ---------- Завдання 2. Користувачі (ООП) ----------
class User {
    constructor(surname, name, age, education, purpose, date) {
        Object.assign(this, { surname, name, age, education, purpose, date: new Date(date) });
    }
    get fullName() { return `${this.surname} ${this.name}`; }
    get time() { return this.date.toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' }); }
    get group() {
        const minutes = this.date.getHours() * 60 + this.date.getMinutes();
        const workTime = minutes >= 9 * 60 && minutes <= 17 * 60;
        if (this.age >= 45 && this.age < 60 && workTime) return 'середній вік, робочий час';
        if (this.age >= 60 && !workTime) return 'похилий вік, неробочий час';
        return 'інші';
    }
}
const users = [
    new User('Шевчук', 'Олена', 47, 'вища', 'співпраця', '2026-10-03T10:15'),
    new User('Бойко', 'Андрій', 63, 'професійна', 'скарга', '2026-10-07T19:40'),
    new User('Ткаченко', 'Ірина', 29, 'вища', 'пропозиція', '2026-10-12T14:05'),
    new User('Кравченко', 'Петро', 71, 'повна', 'наявність помилки', '2026-10-15T07:30'),
    new User('Олійник', 'Марія', 52, 'вища', 'співпраця', '2026-10-21T16:50'),
    new User('Лисенко', 'Дмитро', 35, 'неповна', 'пропозиція', '2026-09-28T11:00'),
    new User('Мороз', 'Галина', 66, 'вища', 'скарга', '2026-10-25T22:10'),
    new User('Савченко', 'Ігор', 58, 'професійна', 'співпраця', '2026-11-02T09:00'),
    new User('Яковенко', 'Софія', 24, 'вища', 'наявність помилки', '2026-10-28T18:20'),
    new User('Гнатюк', 'Василь', 61, 'повна', 'пропозиція', '2026-10-09T12:30'),
];

// 2.1 Хто звернувся у жовтні 2026 до заданого моменту.
const moment = new Date('2026-10-20T12:00');
const inMonth = users.filter(u => u.date.getMonth() === moment.getMonth() && u.date <= moment).sort((a, b) => a.date - b.date);
print(`2.1 Звернення за жовтень до ${moment.toLocaleString('uk-UA')}`, inMonth.map(u => `${u.fullName.padEnd(18)} ${u.time}`));

// 2.2 Середній вік.
const avgAge = users.reduce((sum, u) => sum + u.age, 0) / users.length;
print('2.2 Середній вік користувача', `${avgAge.toFixed(1)} року`);

// 2.3 Класи за віком і часом звернення.
const counts = { 'середній вік, робочий час': 0, 'похилий вік, неробочий час': 0, 'інші': 0 };
let i = 0;
while (i < users.length) {
    counts[users[i].group] += 1;
    i++;
}
print('2.3 Класи користувачів', [
    ...users.map(u => `${u.fullName.padEnd(18)} ${String(u.age).padStart(2)} р., ${u.time} → ${u.group}`), '',
    ...Object.entries(counts).map(([name, n]) => `${name}: ${n}`),
]);

// 2.4 Алфавітний порядок із метою звернення.
const abc = [...users].sort((a, b) => a.surname.localeCompare(b.surname, 'uk'));
print('2.4 Користувачі за алфавітом', abc.map((u, n) => `${n + 1}. ${u.fullName} — ${u.purpose.toUpperCase()}`));

// ---------- Типи даних і перетворення ----------
const samples = {
    'duration: 6': 6, "name: 'Енергоаудит'": 'Енергоаудит', 'complete: true': true, 'gov нового запису': undefined,
    "Symbol('id')": Symbol('id'), '10n': 10n, 'null': null, 'directions': directions, 'users[0]': users[0], 'serviceTime': serviceTime,
};
print('Типи даних (typeof)', Object.entries(samples).map(([label, v]) => `${label.padEnd(20)} → ${typeof v}`));
print('Явне та неявне перетворення', [
    `Number('12') + 1 = ${Number('12') + 1}`, `parseInt('18 міс.') = ${parseInt('18 міс.')}`,
    `String(2026) + 1 = ${String(2026) + 1}`, `Boolean('') = ${Boolean('')}`,
    `'5' * 2 = ${'5' * 2}`, `'5' + 2 = ${'5' + 2}`, `1 == '1' → ${1 == '1'}, 1 === '1' → ${1 === '1'}`,
    `Math.max(...reads2) = ${Math.max(...directions.map(d => d.reads2 ?? 0))}`,
]);
