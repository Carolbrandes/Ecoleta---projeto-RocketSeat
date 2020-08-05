import Knex from 'knex';

// a funcao up vai servir para atualizar as informacoes no banco
// knex: Knex -> estamos dizendo que o knex é do tipo Knex
// aqui table.string('uf', 2) o 2º parametro e o 2 e quer dizer que esse campo vai ter 2 digitos
export async function up(knex: Knex){
    // criar a tabela
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}

// a funcao e um metodo que podemos voltar atras caso cadastremos uma tabela errada por exemplo
export async function down(knex: Knex){
    // deletar a tabela 
    return knex.schema.dropTable('items');
}