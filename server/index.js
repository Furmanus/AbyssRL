const express = require('express');
const path = require('path');
const jsonpack = require('jsonpack');
const fs = require('fs');
const app = express();

const PORT = 5020;
const SAVE_FILE_PATH = path.resolve(__dirname, 'saves', 'save.txt');

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use('/public', express.static(path.resolve(__dirname, 'public')));

app.get('/save', (req, res) => {
  try {
    const data = fs.readFileSync(SAVE_FILE_PATH, 'utf-8');

    res.set('Content-Type', 'application/json').send(jsonpack.unpack(data));
  } catch (e) {
    res.set(200).end();
  }
});
app.post('/save', (req, res) => {
  const { body } = req;

  fs.writeFileSync(SAVE_FILE_PATH, jsonpack.pack(body), {
    encoding: 'utf-8',
    flag: 'w+',
  });

  res.end();
});
app.delete('/save', (req, res) => {
  fs.writeFileSync(SAVE_FILE_PATH, '', {
    encoding: 'utf-8',
    flag: 'w+',
  });

  res.end();
});

app.listen(5020, () => {
  console.log(`App is listening on port ${PORT}`);
});
