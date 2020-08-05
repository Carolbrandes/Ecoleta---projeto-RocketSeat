import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors())
app.use(express.json());
app.use(routes);

// rota para acessarmos os itens da nossa aplicação
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3334); /* vamos botar a porta que ficará sendo escutada */