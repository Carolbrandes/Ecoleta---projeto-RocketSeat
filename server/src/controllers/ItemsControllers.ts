import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController{
    async index (request: Request, response: Response){
        // é a mesma coisa que select * from items
        const items = await knex('items').select('*');
    
        // tem o nome serializedItems pq vamos transformar os dados para um novo formato
        const serializedItems =  items.map(item => {
            return{
                id: item.id,
                title: item.title,
                // image_url: `http://localhost:3334/uploads/${item.image}`
                image_url: `http://192.168.15.170:3334/uploads/${item.image}`
            };
        });
    
        return response.json(serializedItems);
    }
}

export default ItemsController;