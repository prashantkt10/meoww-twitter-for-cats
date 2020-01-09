const express = require('express'), cors = require('cors');
const app = express(), PORT = process.env.PORT || 8080;
app.use(cors()).use(express.static('public')).use(express.json({ extended: false }));
app.use('/api/mews', require('./routes/api/mews'));
app.listen(PORT, () => { console.log(`Listening on port: ${PORT}`) });