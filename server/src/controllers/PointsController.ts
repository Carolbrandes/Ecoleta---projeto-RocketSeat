import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index(request: Request, response: Response) {
        // vamos pegar o filtro de cidade, uf, items que sera atraves do query Params
        const { city, uf, items } = request.query;
        console.log(city, uf, items);

        // vamos converter o items em um array numerico
        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        // tem o nome serializedItems pq vamos transformar os dados para um novo formato
        const serializedPoints = points.map(point => {
            return {
               ...point,
                image_url: `http://192.168.15.170:3334/uploads/${point.image}`
            };
        });

        return response.json(serializedPoints);

    }

    async show(request: Request, response: Response) {
        // vamos pegar o id
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' });
        }

        const serializedPoint = {
          ...point,
          image_url: `http://192.168.15.170:3334/uploads/${point.image}`
        };

        // vamos pegar os nomes dos itens que esse ponto possui:
        // SELECT * FROM items
        //     join point_items ON items.id = point_items.item_id
        //     WHERE point_items.point_id = {id}
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point: serializedPoint, items });
    }

    async create(request: Request, response: Response) {
        const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;

        // colocamos o transaction pq as duas querys tem q ser executaadas, caso de problema na query 2 (que é a de relacionar o item com point) eu nao quero que a primeira query seja cadastrada
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        // quando inserimos um dado, o knex retorna o id do dado que foi inserido.
        const insertedIds = await trx('points').insert(point);


        const point_id = insertedIds[0];

        // cadastro do relacionamento das tabelas points e items que e a point_items
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                };
            });

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: point_id,
            ...point
        });
    }
}

export default PointsController;