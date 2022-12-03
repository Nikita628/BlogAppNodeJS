import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { accessControl } from './middleware/accessControl';
import { feedRouter } from './routes/feed';
import { rootPath } from './utils/path';

const app = express();

// middleware
app.use(bodyParser.json());
app.use(accessControl);
app.use('/images', express.static(path.join(rootPath, 'images')));

// routes
app.use('/feed', feedRouter);

app.listen(3001);