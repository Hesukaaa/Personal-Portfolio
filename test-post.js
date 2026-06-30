(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'CLI Test', email: 'cli@test.example', message: 'Hello from test script' }),
    });

    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('RESPONSE', text);
  } catch (err) {
    console.error('ERROR', err);
  }
})();
