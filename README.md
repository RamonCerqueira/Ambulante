# 🚀 Street Vendor Connect

Plataforma revolucionária que conecta comerciantes ambulantes com clientes em tempo real através de geolocalização.

## 📋 Características

- ✅ **Geolocalização em Tempo Real**: Encontre vendedores em um raio de 5km
- ✅ **Gerenciamento de Pedidos**: Controle todos os pedidos em um único lugar
- ✅ **Autenticação JWT**: Sistema seguro de login e registro
- ✅ **Dashboard Interativo**: Painel completo para clientes e vendedores
- ✅ **API RESTful**: Backend integrado com Next.js API Routes
- ✅ **Banco de Dados PostgreSQL**: Persistência de dados com Prisma ORM
- ✅ **Design Responsivo**: Interface moderna e intuitiva com Tailwind CSS
- ✅ **Animações Suaves**: Experiência visual aprimorada com Framer Motion

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React moderno
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização responsiva
- **Framer Motion**: Animações fluidas
- **Zustand**: Gerenciamento de estado
- **Axios**: Cliente HTTP

### Backend
- **Next.js API Routes**: Endpoints RESTful
- **Prisma ORM**: Acesso ao banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação segura
- **Bcrypt**: Hash de senhas

## 📦 Instalação

### Pré-requisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 12

### Passos

1. **Clonar o repositório**
```bash
git clone <seu-repositorio>
cd street-vendor-nextjs
```

2. **Instalar dependências**
```bash
npm install
```

3. **Configurar variáveis de ambiente**
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/street_vendor"
JWT_SECRET="sua-chave-secreta-super-segura"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

4. **Sincronizar banco de dados**
```bash
npm run db:push
```

5. **Iniciar servidor de desenvolvimento**
```bash
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## 🚀 Uso

### Para Clientes
1. Cadastre-se como **Cliente**
2. Faça login
3. Vá para o dashboard
4. Encontre vendedores próximos
5. Faça seus pedidos

### Para Vendedores
1. Cadastre-se como **Vendedor**
2. Faça login
3. Complete seu perfil
4. Adicione seus produtos
5. Aguarde pedidos de clientes

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Usuários
- `GET /api/users/me` - Obter perfil (autenticado)
- `PATCH /api/users/me` - Atualizar perfil (autenticado)
- `GET /api/users/vendors/nearby` - Buscar vendedores próximos

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto (vendedor autenticado)

### Pedidos
- `GET /api/orders` - Listar pedidos (autenticado)
- `POST /api/orders` - Criar pedido (cliente autenticado)

## 📁 Estrutura do Projeto

```
street-vendor-nextjs/
├── app/
│   ├── api/                    # API Routes (Backend)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── users/
│   │   ├── products/
│   │   └── orders/
│   ├── (páginas)               # Páginas (Frontend)
│   │   ├── page.tsx            # Home
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── globals.css
├── lib/                        # Utilitários
│   ├── auth.ts                 # Funções de autenticação
│   ├── utils.ts                # Funções utilitárias
│   ├── prisma.ts               # Cliente Prisma
│   ├── store.ts                # Store Zustand
│   └── api-client.ts           # Cliente HTTP
├── prisma/
│   └── schema.prisma           # Schema do banco de dados
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.example
```

## 🔐 Segurança

- Senhas são hasheadas com Bcrypt
- Autenticação via JWT com expiração
- Validação de entrada em todas as rotas
- CORS configurado
- Proteção contra SQL injection (Prisma)

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor de desenvolvimento

# Build
npm run build            # Build para produção
npm run start            # Iniciar servidor de produção

# Banco de dados
npm run db:push          # Sincronizar schema com banco
npm run db:migrate       # Criar migração
npm run db:studio        # Abrir Prisma Studio

# Linting
npm run lint             # Verificar linting
```

## 📊 Modelo de Dados

### User
- id, email, password, name, role, avatar, phone, address, latitude, longitude

### Vendor
- id, userId, businessName, description, rating, latitude, longitude, radius

### Product
- id, vendorId, name, description, price, image, category, stock

### Order
- id, customerId, vendorId, status, totalPrice, deliveryAddress, deliveryLatitude, deliveryLongitude

### OrderItem
- id, orderId, productId, quantity, price

## 🌍 Geolocalização

O sistema usa a **fórmula de Haversine** para calcular a distância entre dois pontos:

```
GET /api/users/vendors/nearby?latitude=-12.9714&longitude=-38.5104&radiusKm=5
```

## 🚀 Deploy

### Vercel (Frontend + Backend)
```bash
npm run build
npm run start
```

Ou fazer deploy direto no Vercel:
1. Conectar repositório no Vercel
2. Configurar variáveis de ambiente
3. Deploy automático

### Banco de Dados
- Usar serviço gerenciado (Railway, Render, AWS RDS)
- Atualizar `DATABASE_URL` nas variáveis de ambiente

## 📝 Próximos Passos

- [ ] Implementar WebSockets para chat em tempo real
- [ ] Adicionar sistema de notificações push
- [ ] Implementar pagamentos (Stripe, PagSeguro)
- [ ] Adicionar testes unitários e E2E
- [ ] Implementar CI/CD com GitHub Actions
- [ ] Adicionar analytics e monitoring
- [ ] Criar aplicativos móveis (React Native/Flutter)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para transformar o comércio ambulante**

