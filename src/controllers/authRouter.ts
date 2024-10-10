import { prisma } from '../utils/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Rota de login
export const authRouter = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verifica se a senha é válida
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    // Gera um token JWT usando a variável de ambiente para a chave secreta
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "default-secret", { expiresIn: '1h' });

    // Retorna o token
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};

export default authRouter;
