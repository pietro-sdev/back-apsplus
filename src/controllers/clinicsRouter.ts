import { prisma } from '../utils/prisma';
import { Request, Response } from 'express';
import { Parser } from 'json2csv';

// Função para baixar o CSV de clínicas
export const downloadClinicsCSV = async (req: Request, res: Response) => {
  try {
    const clinics = await prisma.clinica.findMany(); // Buscar todas as clínicas do banco de dados

    if (clinics.length === 0) {
      return res.status(404).json({ error: 'Nenhuma clínica encontrada' });
    }

    // Define os campos que serão exportados no CSV na ordem correta
    const fields = [
      { label: 'Nome da Clínica', value: 'nome' },
      { label: 'Telefone', value: 'telefone' },
      { label: 'Endereço', value: 'endereco' },
      { label: 'CEP', value: 'cep' },
      { label: 'Cidade', value: 'cidade' },
      { label: 'Estado', value: 'estado' }
    ];

    // Configura o delimitador como ponto e vírgula (;) para melhor compatibilidade com Excel
    const json2csv = new Parser({ fields, delimiter: ';', quote: '' });

    const csv = json2csv.parse(clinics);

    // Configura o cabeçalho e envia o arquivo CSV
    res.header('Content-Type', 'text/csv');
    res.attachment('clinicas.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Erro ao gerar CSV de clínicas:', error);
    return res.status(500).json({ error: 'Erro ao gerar CSV de clínicas' });
  }
};

// Função para criar uma nova clínica
export const createClinica = async (req: Request, res: Response) => {
  const { nome, telefone, cep, endereco, cidade, estado } = req.body;

  try {
    // Verifica se já existe uma clínica com o mesmo nome e telefone
    const existingClinica = await prisma.clinica.findFirst({
      where: {
        OR: [{ nome }, { telefone }],
      },
    });

    if (existingClinica) {
      const message =
        existingClinica.nome === nome
          ? 'Clínica com este nome já existe'
          : 'Clínica com este telefone já existe';
      return res.status(400).json({ error: message });
    }

    const newClinica = await prisma.clinica.create({
      data: {
        nome,
        telefone,
        cep,
        endereco,
        cidade,
        estado,
      },
    });

    return res.status(201).json({
      message: "Clínica criada com sucesso",
      clinica: newClinica,
    });
  } catch (error) {
    console.error('Erro ao criar clínica:', error);
    return res.status(500).json({ error: 'Erro ao criar clínica' });
  }
};

// Função para obter todas as clínicas
export const getClinics = async (req: Request, res: Response) => {
  try {
    const clinics = await prisma.clinica.findMany();
    return res.status(200).json(clinics);
  } catch (error) {
    console.error('Erro ao buscar clínicas:', error);
    return res.status(500).json({ error: 'Erro ao buscar clínicas' });
  }
};

// Função para excluir uma clínica
export const deleteClinica = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const clinica = await prisma.clinica.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({
      message: 'Clínica excluída com sucesso.',
      clinica,
    });
  } catch (error) {
    console.error('Erro ao excluir clínica:', error);
    return res.status(500).json({ error: 'Erro ao excluir clínica.' });
  }
};
