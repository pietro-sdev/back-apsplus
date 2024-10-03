import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Transporter para o Nodemailer (configuração de e-mail)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Ou outro serviço de e-mail
  auth: {
    user: process.env.EMAIL_USER, // Email de origem
    pass: process.env.EMAIL_PASSWORD, // Senha do email
  },
});

// Função para gerar o token JWT
const generateToken = (email: string) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY não definido nas variáveis de ambiente.');
  }

  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  return token;
};

// Função para enviar o e-mail
const sendAccountCreationEmail = async (email: string) => {
  const token = generateToken(email);

  const link = `http://localhost:3000/criar-senha?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Criação de Conta',
    html: `<p>Clique no link abaixo para criar sua conta:</p>
           <a href="${link}">CRIAR CONTA</a>`,
  };

  await transporter.sendMail(mailOptions);
};

// Função para cadastrar o funcionário e enviar e-mail
export const createEmployee = async (req: Request, res: Response) => {
  const { fullName, cpf, phone, email, cep, address, number, complement, neighborhood, city, state } = req.body;

  try {
    const existingEmployee = await prisma.employee.findUnique({ where: { cpf } });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Funcionário com este CPF já existe' });
    }

    const newEmployee = await prisma.employee.create({
      data: { fullName, cpf, phone, email, cep, address, number, complement, neighborhood, city, state },
    });

    // Envia e-mail de criação de conta
    await sendAccountCreationEmail(email);

    return res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
};

// Função para criar a senha com o token
export const criarSenha = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    // Verifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { email: string };

    // Verifica se o token é válido
    if (!decoded.email) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    
      await prisma.employee.update({
        where: { email: decoded.email },
        data: { password: hashedPassword },
      });
      

    return res.status(200).json({ message: 'Senha criada com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar senha' });
  }
};

// Rota para obter todos os funcionários
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();
    return res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
};

// Rota para excluir um funcionário
export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({ message: 'Funcionário excluído com sucesso', employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao excluir funcionário' });
  }
};
