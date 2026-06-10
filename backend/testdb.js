const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:aquamarket123@aquamarket-db.cpekyeyyoyy7.ap-southeast-2.rds.amazonaws.com:5432/aquamarket' });
client.connect().then(() => {
  return client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'");
}).then(res => {
  console.log(res.rows.map(r => r.column_name));
  return client.end();
}).catch(console.error);
