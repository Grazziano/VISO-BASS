# VISO-BASS 🛰️

VISO-B.A.S.S. — VISO-Based API for Structured Storage
Uma API projetada para armazenamento estruturado e eficiente de dados no contexto da Social IoT, implementada com NestJS e MongoDB.

O sistema adota a abordagem estrutural do modelo VISO, garantindo organização, escalabilidade e consultas otimizadas para informações relacionadas a objetos, classes, interações, ambientes e relações sociais.

Este projeto integra a pesquisa de mestrado realizada na Universidade Federal de Pelotas (UFPEL), intitulada:
"VISO-BASS: Uma Proposta Estrutural para Persistência de Dados na Social IoT".

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/Grazziano/VISO-BASS?style=flat-square)](https://github.com/Grazziano/VISO-BASS/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/Grazziano/VISO-BASS?style=flat-square)](https://github.com/Grazziano/VISO-BASS/issues)

<!-- > **API desenvolvida com NestJS e MongoDB para persistência de dados no contexto da Social IoT**, seguindo a proposta estrutural da abordagem **VISO**.  
> Parte da pesquisa de mestrado: **"VISO-BASS: Uma Proposta Estrutural para Persistência de Dados na Social IoT"**. -->

---

## 📸 Demonstração

![Demonstração da API](docs/gif_rodando_api.gif)  
<!-- <sub>*Api rodando*</sub> -->

---

## 📌 Status do Projeto

| Status Geral      | API | Banco de Dados | Documentação | Testes |
|-------------------|-----|---------------|--------------|--------|
| 🚀 Em desenvolvimento | 🛠️ Em andamento | ✅ Concluído | 🛠️ Em andamento | 🛠️ Em andamento |

---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — Framework Node.js para construção de APIs escaláveis
- [MongoDB](https://www.mongodb.com/) — Banco de dados NoSQL
- [Mongoose](https://mongoosejs.com/) — ODM para modelagem de dados
- [TypeScript](https://www.typescriptlang.org/) — Linguagem tipada para JavaScript
- [Dotenv](https://github.com/motdotla/dotenv) — Variáveis de ambiente

---

## 📂 Estrutura do Projeto

```bash
docs/                 # Arquivos de documentação
src/
├── modules/          # Módulos da aplicação
│   ├── auth/
│   ├── interaction/
│   ├── ona-enviroment/
│   ├── pagerank-friendship/
│   ├── users/
│   ├── viso-class/
│   ├── viso-object/
├── common/           # Utilitários e middlewares
├── app.controller.ts # Controller raiz
├── app.module.ts     # Módulo raiz
├── app.service.ts    # Service raiz
├── main.ts           # Ponto de entrada da aplicação
test/                 # Testes unitários
````

---

## ⚙️ Pré-requisitos

* [Node.js](https://nodejs.org/) **>= 18**
* [MongoDB](https://www.mongodb.com/) ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [Git](https://git-scm.com/)

---

## 📥 Instalação

```bash
# Clonar o repositório
git clone https://github.com/Grazziano/VISO-BASS.git

# Acessar o diretório
cd VISO-BASS

# Instalar dependências
npm install
```

---

## 🔑 Configuração

Crie um arquivo **`.env`** na raiz do projeto ou renomeie o arquivo **`.env.example`**:

```env
MONGO_URI=mongodb://localhost:27017/viso-bass
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h
```

Para usar no **MongoDB Atlas**:

```env
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/viso-bass
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h
```

---

## ▶️ Executando a Aplicação

```bash
# Ambiente de desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

Acesse:

```
http://localhost:3000
```

---

## 🐳 Rodando com Docker

O projeto possui um **ambiente completo via Docker Compose**, incluindo:

* **API NestJS** (porta `3000`)
* **MongoDB** (porta `27017`)
* **Mongo Express** – interface web para o banco (porta `8081`)

---

### 📋 Pré-requisitos

* [Docker](https://www.docker.com/get-started) instalado
* [Docker Compose](https://docs.docker.com/compose/) instalado

---

### ⚙️ Configuração do `.env` para Docker

No arquivo `.env` na raiz do projeto, defina:

```env
MONGO_URI=mongodb://mongo:27017/viso-bass
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h
```

> Importante: o host do Mongo é `mongo`, que é o nome do serviço no `docker-compose.yml`.

---

### 🚀 Subindo o ambiente

```bash
docker-compose up --build
```

Após a inicialização:

* **API:** [http://localhost:3000](http://localhost:3000)
* **Mongo Express:** [http://localhost:8081](http://localhost:8081)

  * Usuário: `admin`
  * Senha: `admin`

---

### 📦 Parando os containers

```bash
docker-compose down
```

Para também remover os dados persistidos no banco:

```bash
docker-compose down -v
```

---

### 💡 Dicas

* O Mongo Express é útil para **visualizar coleções, inserir, editar e excluir documentos** diretamente via navegador.
* As alterações feitas no Mongo Express são refletidas imediatamente na API.
* O volume `mongo_data` garante que os dados do banco persistam mesmo que os containers sejam reiniciados.


---

## 📚 Endpoints Principais

| Método | Rota                 | Descrição                   |
| ------ | -------------------- | --------------------------- |
| GET    | /api                 | Lista todos os endpoints    |
| POST   | /auth/register       | Cria um novo usuário        |
| POST   | /auth/login          | Efetua login                |
| GET    | /object              | Lista todos os objetos      |
| GET    | /object/:id          | Encontra objeto pelo id     |
| POST   | /object              | Cria um novo objeto         |
| GET    | /class               | Lista todas as classes      |
| GET    | /class/:id           | Encontra classe pelo id     |
| POST   | /class               | Cria uma nova classe        |
| GET    | /interaction         | Lista todas as interações   |
| POST   | /interaction         | Cria uma nova interação     |
| GET    | /ona-enviroment      | Lista todos os ambientes    |
| POST   | /ona-enviroment      | Cria um novo ambiente       |
| GET    | /pagerank-friendship | Lista relações de amizade   |
| POST   | /pagerank-friendship | Cria uma relação de amizade |

---

## 🧪 Testes

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.

---

## 🔗 Links

* **Repositório:** [VISO-BASS no GitHub](https://github.com/Grazziano/VISO-BASS)
* **NestJS:** [Documentação Oficial](https://docs.nestjs.com/)
* **MongoDB:** [Documentação Oficial](https://www.mongodb.com/docs/)


## 🌟 Contato & Suporte

**Precisa de ajuda ou quer colaborar?** Estou disponível para trocar ideias e parcerias!

📬 **Meios de contato:**
- [LinkedIn](https://www.linkedin.com/in/grazziano-fagundes/)

---

<div align="center">
  <sub>Desenvolvido com ❤️ por <a href="https://github.com/Grazziano">Grazziano Borges Fagundes</a></sub><br>
  <sub>© 2025 - Todos os direitos reservados</sub>
</div>
