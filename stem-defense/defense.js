const copyButton = document.querySelector('.copy');

if (navigator.clipboard) {
  const sample = document.querySelector('#example-text');
  const status = document.querySelector('.copy-status');
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(sample.textContent.trim());
      status.textContent = 'Відгук скопійовано.';
    } catch {
      status.textContent = 'Виділи й скопіюй текст відгуку вручну.';
    }
  });
}
