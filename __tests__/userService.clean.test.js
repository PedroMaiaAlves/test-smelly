const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('cria um usuário adulto com os dados e valores padrão esperados', () => {
    // Arrange
    const nome = 'Fulano de Tal';
    const email = 'fulano@teste.com';
    const idade = 25;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado).toEqual({
      id: expect.any(String),
      nome,
      email,
      idade,
      isAdmin: false,
      createdAt: expect.any(Date),
      status: 'ativo',
    });
  });

  test('recupera um usuário existente pelo identificador', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      'Maria Souza',
      'maria@teste.com',
      31
    );

    // Act
    const usuarioEncontrado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioEncontrado).toEqual(usuarioCriado);
  });
  //Comum
  test('desativa um usuário que não é administrador', () => {
    // Arrange
    const usuarioComum = userService.createUser(
      'Usuário Comum',
      'comum@teste.com',
      30
    );

    // Act
    const foiDesativado = userService.deactivateUser(usuarioComum.id);

    // Assert
    expect(foiDesativado).toBe(true);
    expect(userService.getUserById(usuarioComum.id).status).toBe('inativo');
  });
  //Administrador
  test('impede a desativação de um administrador', () => {
    // Arrange
    const administrador = userService.createUser(
      'Administrador',
      'admin@teste.com',
      40,
      true
    );

    // Act
    const foiDesativado = userService.deactivateUser(administrador.id);

    // Assert
    expect(foiDesativado).toBe(false);
    expect(userService.getUserById(administrador.id).status).toBe('ativo');
  });

  test('inclui os usuários cadastrados no relatório', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Relatório de Usuários');
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
    expect(relatorio).toContain('ativo');
  });

  test('informa quando não há usuários cadastrados no relatório', () => {
    // Arrange
    const mensagemEsperada = 'Nenhum usuário cadastrado.';

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain(mensagemEsperada);
  });

  test('rejeita a criação de usuário menor de idade', () => {
    // Arrange
    const criarUsuarioMenor = () =>
      userService.createUser('Menor', 'menor@email.com', 17);

    // Act & Assert
    expect(criarUsuarioMenor).toThrow('O usuário deve ser maior de idade.');
  });
});
