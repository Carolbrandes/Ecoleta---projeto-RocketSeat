import knex from 'knex';
import path from 'path';

// vai receber as configuracoes do bd
// filename: ql arquivo sera armazenado o bd
// path.resolve() - ela une caminhos
// __dirname -> e uma variavel global que vai retornar o diretorio do arquivo que vamos executar
const connection = knex({
    client: 'sqlite3',
    connection:{
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
});

export default connection;

// migrations: histórico do bando de dados. Vamos ter migrations para criar tabelas, alterar tabelas e etc. Entao por exemplo facilita a vida de um euqipe. O programador A criou a Tabela A e outro programador criou a tabela B, usando o migrations com um comando juntamos essas duas tabelas. Ja se nao usarmos teremos que pedir para o porgramador passar o comando q ele usou para executar na minha maquina.
// a ordem q voce cria as migrations na pasta e importante