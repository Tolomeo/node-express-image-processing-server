const path = require('path');
const {Router} = require('express');
const multer = require('multer');

// eslint-disable-next-line new-cap
const router = Router();

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

router.get('/photo-viewer', (request, response) => {
  response.sendFile(photoPath);
});

const filename = (request, file, callback) => {
  callback(null, file.originalname);
};

const storage = multer.diskStorage({
  destination: 'api/uploads/',
  filename: filename,
});

const fileFilter = (request, file, callback) => {
  if (file.mimetype !== 'image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'));
    return;
  }

  callback(null, true);
};

const upload = multer({fileFilter, storage});

router.post('/upload', upload.single('photo'), (request, response) => {
  if (request.fileValidationError) {
    response.status(400).json({
      error: request.fileValidationError,
    });
    return;
  }

  response.status(201).json({
    success: true,
  });
});

module.exports = router;
