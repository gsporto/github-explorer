import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import { Title, Form, Repositories, Error } from './styles';
import logoImg from '../../assets/logo.svg';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositorys = localStorage.getItem(
      '@GithubExplorer:repositories',
    );

    if (storagedRepositorys) {
      return JSON.parse(storagedRepositorys);
    }
    return [];
  });

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    try {
      event.preventDefault();

      if (!newRepo) {
        setInputError('Digite o usuário/nome do repositório');
        return;
      }
      const response = await api.get<Repository>(`repos/${newRepo}`);

      setRepositories([...repositories, response.data]);
      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por esse repositorio');
    }
  }

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar </button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
