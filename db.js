const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017/login-system',
  { useNewUrlParser: true, useUnifiedTopology: true },
  console.log('Database Connected')
);
