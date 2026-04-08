import 'dotenv/config';
import { createServer } from './configs/server.js';

const app = createServer();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`SenGarage backend running on ${port}`);
});
