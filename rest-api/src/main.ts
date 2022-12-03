import bodyParser from 'body-parser';
import express from 'express';
import { accessControl } from './middleware/accessControl';
import { feedRouter } from './routes/feed';

const app = express();

app.use(bodyParser.json());

app.use(accessControl);

app.use('/feed', feedRouter);

app.listen(3000);