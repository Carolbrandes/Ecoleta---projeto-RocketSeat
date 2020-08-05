import Knex from 'knex';

// a funcao up vai servir para atualizar as informacoes no banco
// knex: Knex -> estamos dizendo que o knex é do tipo Knex
// aqui table.string('uf', 2) o 2º parametro e o 2 e quer dizer que esse campo vai ter 2 digitos
export async function up(knex: Knex){
    // criar a tabela
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();

        // criando uma chave estrangeira na tabela points
        // ele vai criar uma chave estrangeira na tabela point no campo id
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');


        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');
    });
}

// a funcao e um metodo que podemos voltar atras caso cadastremos uma tabela errada por exemplo
export async function down(knex: Knex){
    // deletar a tabela 
    return knex.schema.dropTable('point_items');
}