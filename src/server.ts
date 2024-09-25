import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routers/main";

const server = express();
server.use(helmet());
server.use(cors({
    origin: 'https://front-apsplus.vercel.app', // Permitir seu frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true // Se você estiver usando autenticação com cookies
  }));
server.use(urlencoded({ extended: true }));
server.use(express.json());

server.use(mainRouter);

server.listen(process.env.PORT || 3001, () => {
    console.log(`Servidor rodando na porta ${process.env.BASE_URL}`);
});
 