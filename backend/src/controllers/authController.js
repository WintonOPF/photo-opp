const users = [
  {
    id: '1',
    name: 'Promotor Nex',
    username: 'promotor',
    password: '123',
    role: 'PROMOTOR'
  },
  {
    id: '2',
    name: 'Administrador Nex',
    username: 'admin',
    password: '123',
    role: 'ADMIN'
  }
];

export function login(req, res) {
  const { username, password } = req.body;

  const user = users.find(
    (item) => item.username === username && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: 'Usuário ou senha inválidos'
    });
  }

  return res.json({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    token: `fake-token-${user.role.toLowerCase()}`
  });
}