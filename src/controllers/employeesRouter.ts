import { prisma } from '../utils/prisma';
import { Request, Response } from 'express';
import { Parser } from 'json2csv';

export const downloadEmployeesCSV = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany(); // Buscar todos os funcionários do banco de dados

    if (employees.length === 0) {
      return res.status(404).json({ error: 'Nenhum funcionário encontrado' });
    }

    // Define os campos que serão exportados no CSV na ordem correta
    const fields = [
      { label: 'Nome', value: 'fullName' }, 
      { label: 'Profissao', value: 'profession' },
      { label: 'Telefone', value: 'phone' }, 
      { label: 'CPF', value: 'cpf' }, 
      { label: 'E-mail', value: 'email' }
    ];

    // Configura o delimitador como ponto e vírgula (;) para melhor compatibilidade com Excel
    const json2csv = new Parser({ fields, delimiter: ';', quote: '' }); // Define o delimitador como ponto e vírgula e remove aspas duplas

    const csv = json2csv.parse(employees);

    // Configura o cabeçalho e envia o arquivo CSV
    res.header('Content-Type', 'text/csv');
    res.attachment('funcionarios.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Erro ao gerar CSV de funcionários:', error);
    return res.status(500).json({ error: 'Erro ao gerar CSV de funcionários' });
  }
};


export const createEmployee = async (req: Request, res: Response) => {
  const { fullName, cpf, phone, email, cep, address, number, complement, neighborhood, city, state } = req.body;

  try {
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [{ cpf }, { email }],
      },
    });

    if (existingEmployee) {
      const message =
        existingEmployee.cpf === cpf
          ? 'Funcionário com este CPF já existe'
          : 'Funcionário com este e-mail já existe';
      return res.status(400).json({ error: message });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        fullName,
        cpf,
        phone,
        email,
        cep,
        address,
        number,
        complement,
        neighborhood,
        city,
        state,
      },
    });

    return res.status(201).json({
      message: "Funcionário criado com sucesso",
      employee: newEmployee,
    });
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    return res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
};

// Função para obter todos os funcionários
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();
    return res.status(200).json(employees);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    return res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
};

// Função para excluir um funcionário
export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({
      message: 'Funcionário excluído com sucesso.',
      employee,
    });
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    return res.status(500).json({ error: 'Erro ao excluir funcionário.' });
  }
};
