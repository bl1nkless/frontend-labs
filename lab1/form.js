// Демонстрація форми без сервера. required та типи полів перевіряє браузер.
const form = document.getElementById('feedback-form');
const result = document.getElementById('form-result');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    result.textContent = 'Форму заповнено правильно. Це навчальна демонстрація: дані не надіслано.';
});

form.addEventListener('reset', function () {
    result.textContent = '';
});
