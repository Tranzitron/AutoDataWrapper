import {DataSource} from "typeorm";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "db.sqlite",
    logging: true,
    synchronize: true, // ONLY FOR DEV, will scrap db each restart
    entities: ["src/entity/*.ts"],
    subscribers: [],
    migrations: [],
})