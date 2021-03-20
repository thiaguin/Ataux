module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: 'all',
    entities: ['{dist, src}/**/*.entity{.ts,.js}'],
    migrations: ['{dist, src}/**/*.migration{.ts,.js}', '{dist, src}/**/*.seed{.ts,.js}'],
    subscribers: ['{dist, src}/**/*.subscriber{.ts,.js}'],
};
