import * as express from 'express';
import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import * as multer from 'multer';
import firebaseConfig from './firebase.Config';

const router: express.Router = express.Router();

initializeApp(firebaseConfig);

const storage = getStorage();

export const firebaseUpload = async (req, res, next: express.NextFunction) => {
  try {
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + '       ' + dateTime}`
    );

    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('File successfully uploaded.');

    req.body.downloadURL = downloadURL;

    next();
  } catch (error) {
    return next(res.status(400).send(error.message));
  }
};

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
};
