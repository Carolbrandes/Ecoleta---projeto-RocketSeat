import path from 'path';

// temos que usar essa sintaxe e nao export default,  pq o knex nao suporta essa sintaxe.
module.exports = {
    client: 'sqlite3',
    connection:{
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
    },

    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },

    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },

    useNullAsDefault: true,
};