import express, { response } from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsControllers';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';

// com o Router desacoplamos as rotas do arquivo principal server.ts 
const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

// rota para listar os itens
routes.get('/items', itemsController.index);

// rota para retornar os points filtrando por cidade, estados 
routes.get('/points', pointsController.index);

// rota para exibir um ponto de venda
routes.get('/points/:id', pointsController.show);


// rota para cadastrar os pontos de coleta
// se fossemos receber mais de um arquivo seria upload.array
// como json nao aceita receber arquivos, vamos ter que usar uma outra estrutura formData ou multiFormData
//upload.single('name_do_campo')
// a imagem nao e validada no celebrate, mas no multer.
routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        })
    },
        {
            abortEarly: false
        }
    ),

    pointsController.create);

export default routes;

// usamos:
// index -> para exibir uma listagem
// show -> para exibir um único registro
// create
// update
// delete
