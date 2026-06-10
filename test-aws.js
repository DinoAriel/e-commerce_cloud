const http = require('http');

http.get('http://13.239.15.116', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      console.log('JS url:', match[1]);
      http.get('http://13.239.15.116' + match[1], (res2) => {
        let js = '';
        res2.on('data', d => js += d);
        res2.on('end', () => {
          console.log('Contains Supabase?', js.includes('Email not confirmed'));
        });
      });
    }
  });
});
