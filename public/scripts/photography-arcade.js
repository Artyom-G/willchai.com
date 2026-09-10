(() => {
  const form = document.querySelector('[data-photo-inquiry-form]');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    const location = String(data.get('location') || '').trim();
    const date = String(data.get('date') || '').trim();
    const details = [
      title ? 'Event: ' + title : '',
      location ? 'Place: ' + location : '',
      date ? 'Date: ' + date : '',
    ].filter(Boolean);
    const body = [
      'Hi Will,',
      '',
      'I would like to talk about a photography shoot.',
      ...(details.length ? ['', ...details] : []),
      '',
    ].join('\n');
    const subject = title ? title + ' | Photography inquiry' : 'Photography inquiry';
    window.location.href = 'mailto:me@willchai.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
