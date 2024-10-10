import { prisma } from '../utils/prisma';
import { Request, Response } from 'express';
import { Parser } from 'json2csv';

// Função para baixar CSV de pacientes
export const downloadPatientsCSV = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.paciente.findMany(); // Buscar todos os pacientes do banco de dados

    if (patients.length === 0) {
      return res.status(404).json({ error: 'Nenhum paciente encontrado' });
    }

    // Define os campos que serão exportados no CSV na ordem correta
    const fields = [
      { label: 'Nome Completo', value: 'nomeCompleto' },
      { label: 'CPF', value: 'cpf' },
      { label: 'Telefone', value: 'telefone' },
      { label: 'E-mail', value: 'email' },
      { label: 'Gênero', value: 'genero' },
      { label: 'Data de Nascimento', value: 'dataNascimento' },
      { label: 'Endereço', value: 'endereco' },
      { label: 'Cidade', value: 'cidade' },
      { label: 'Estado', value: 'estado' }
    ];

    // Configura o delimitador como ponto e vírgula (;) para melhor compatibilidade com Excel
    const json2csv = new Parser({ fields, delimiter: ';', quote: '' });

    const csv = json2csv.parse(patients);

    // Configura o cabeçalho e envia o arquivo CSV
    res.header('Content-Type', 'text/csv');
    res.attachment('pacientes.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Erro ao gerar CSV de pacientes:', error);
    return res.status(500).json({ error: 'Erro ao gerar CSV de pacientes' });
  }
};

// Rota para criar um novo paciente
export const createPatient = async (req: Request, res: Response) => {
  const {
    nomeCompleto,
    nomeSocial,
    rg,
    cpf,
    dataNascimento,
    genero,
    racaCor,
    telefone,
    email,
    estadoCivil,
    profissao,
    cep,
    endereco,
    bairro,
    cidade,
    estado,
    numero,
    numeroConvenio,
    relacaoComTitular,
    plano,
  } = req.body;

  try {
    // Verifica se já existe um paciente com o mesmo CPF ou email
    const existingPatient = await prisma.paciente.findFirst({
      where: {
        OR: [{ cpf }, { email }],
      },
    });

    if (existingPatient) {
      const message =
        existingPatient.cpf === cpf
          ? 'Paciente com este CPF já existe'
          : 'Paciente com este e-mail já existe';
      return res.status(400).json({ error: message });
    }

    // Cria o paciente
    const newPatient = await prisma.paciente.create({
      data: {
        nomeCompleto,
        nomeSocial,
        rg,
        cpf,
        dataNascimento: new Date(dataNascimento),
        genero,
        racaCor,
        telefone,
        email,
        estadoCivil,
        profissao,
        cep,
        endereco,
        bairro,
        cidade,
        estado,
        numero,
        numeroConvenio,
        relacaoComTitular,
        plano,
      },
    });

    return res.status(201).json({
      message: 'Paciente criado com sucesso',
      patient: newPatient,
    });
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    return res.status(500).json({ error: 'Erro ao criar paciente' });
  }
};

// Função para obter todos os pacientes
export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.paciente.findMany();
    return res.status(200).json(patients);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
};

// Função para excluir um paciente
export const deletePatient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const patient = await prisma.paciente.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({
      message: 'Paciente excluído com sucesso.',
      patient,
    });
  } catch (error) {
    console.error('Erro ao excluir paciente:', error);
    return res.status(500).json({ error: 'Erro ao excluir paciente.' });
  }
};
