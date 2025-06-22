const express = require('express');
const documentRoutes = require('./routes/documentRoutes.js');

const app = express();


app.use(express.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/testapi', documentRoutes); 

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
