const $ = id => document.getElementById(id);
const screens = ['time', 'card', 'steps', 'done'];
let range = null, current = null, step = 0;
function show(name) {
screens.forEach(s => { $('screen-' + s).hidden = (s !== name); });
window.scrollTo(0, 0);
}
// Этап 6: случайный выбор
function pickSkill() {
const pool = SKILLS.filter(s => s.minutes >= range[0] && s.minutes <=
range[1]);
if (pool.length === 0) { current = null; return; }
const options = pool.length > 1 ? pool.filter(s => s !== current) : pool;
current = options[Math.floor(Math.random() * options.length)];
}
function showCard() {
show('card');
const empty = current === null;
['card', 'start', 'another'].forEach(id => { $(id).hidden = empty; });
$('empty').hidden = !empty;
if (empty) {
$('empty').textContent = 'В этом интервале пока нет занятий. Выбери другое время!';
return;
}
$('c-title').textContent = current.title;
$('c-desc').textContent = current.desc;
$('c-time').textContent = '⏱ ' + current.minutes + ' мин';
$('c-level').textContent = current.level;
$('c-mats').innerHTML = '';
current.materials.forEach(m => {
const li = document.createElement('li');
li.textContent = m;
$('c-mats').appendChild(li);
});
}
function chooseRange(min, max) {
range = [min, max];
current = null;
pickSkill();
showCard();
}
document.querySelectorAll('.time-btn').forEach(b => {
b.onclick = () => chooseRange(+b.dataset.min, +b.dataset.max);
});
$('surprise').onclick = () => chooseRange(0, Infinity);
$('another').onclick = () => { pickSkill(); showCard(); };
$('back').onclick = () => show('time');
// Этап 7: пошаговая инструкция
function renderStep() {
const total = current.steps.length;
$('step-num').textContent = 'Шаг ' + (step + 1) + ' из ' + total;
$('step-text').textContent = current.steps[step];
$('bar').style.width = ((step + 1) / total * 100) + '%';
$('prev').disabled = (step === 0);
$('next').textContent = (step === total - 1) ? 'Готово ✓' : 'Далее →';
}
function startSteps() { step = 0; renderStep(); show('steps'); }
function finish() {
$('done-text').textContent =
'Частая ошибка: ' + current.mistakes + ' Что дальше: ' + current.next;
show('done');
}
$('start').onclick = startSteps;
$('again').onclick = startSteps;
$('prev').onclick = () => { if (step > 0) { step--; renderStep(); } };
$('next').onclick = () => {
if (step < current.steps.length - 1) { step++; renderStep(); }
else finish();
};
$('new').onclick = () => { pickSkill(); showCard(); };