import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routers/main";

const server = express();

// Configuração de segurança com helmet
server.use(helmet());

// Configuração do CORS para permitir todas as origens
server.use(cors());

// Outras configurações
server.use(urlencoded({ extended: true }));
server.use(express.json());

// Roteamento principal
server.use(mainRouter);

// Inicialização do servidor
server.listen(process.env.PORT || 3001, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3001}`);
});
