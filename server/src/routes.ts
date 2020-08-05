import express, { response } from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/itemsControllers';

// com o Router desacoplamos as rotas do arquivo principal server.ts 
const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

// rota para listar os itens
routes.get('/items', itemsController.index);

// rota para cadastrar os pontos de coleta
routes.post('/points', pointsController.create);

// rota para retornar os points filtrando por cidade, estados 
routes.get('/points', pointsController.index);

// rota para exibir um ponto de venda
routes.get('/points/:id', pointsController.show);

export default routes;

// usamos:
// index -> para exibir uma listagem
// show -> para exibir um único registro
// create
// update
// delete
