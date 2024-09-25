import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routers/main";

const server = express();

// Definir origens permitidas
const allowedOrigins = ['https://front-apsplus.vercel.app/login', 'https://front-apsplus.vercel.app'];

// Configurações do CORS
const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204 // Resposta para requisições preflight
};

// Aplicar o middleware Helmet para segurança
server.use(helmet());

// Aplicar o middleware CORS
server.use(cors(corsOptions));

// Middleware para parsear dados urlencoded e JSON
server.use(urlencoded({ extended: true }));
server.use(express.json());

// Middleware para logar requisições (opcional, para debug)
server.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Aplicar as rotas principais
server.use(mainRouter);

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
