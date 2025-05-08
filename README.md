<h1 align="center">
     🛒 <a href="#" alt=""> Lojinha do quebra </a>
</h1>

<h3 align="center">
     Sistema web  PDV 
</h3>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/badge/languages-4-green">
</p>


Tabela de conteúdos
=================

   * [Sobre o projeto](#sobre-o-projeto)
   * [Funcionalidades](#funcionalidades)
   * [Layout](#layout)
     * [Web](#layout-web)
     * [Mobile](#layout-mobile)
   * [Como executar o projeto](#como-executar-o-projeto)
     * [Pré-requisitos](#pre-requisitos)
     * [Rodando o servidor](#rodando-o-backend)
     * [Rodando a aplicação web (Frontend)](#rodando-a-aplicacao-web-frontend)
     * [Rodando a aplicação mobile (Frontend)](#rodando-a-aplicacao-mobile)
   * [Tecnologias](#tecnologias)
     * [Server](#tecnologias-server)
     * [Website](#tecnologias-website)
     * [Mobile](#tecnologias-mobile)
     * [Utilitários](#utilitarios)
   * [Como contribuir no projeto](#como-contribuir)
   * [Autor](#autor)
   * [Licença](#licenca)



## 💻 Sobre o projeto <a name="sobre-o-projeto"></a>

🛒  O sistema Lojinha do quebra é um projeto de interface web desenvolvido para atender uma loja física que vende
variedades.

---

## ⚙️ Funcionalidades <a name="funcionalidades"></a>

- [x] O proprietário e e administradores da loja poderão:
  - [x] Realizar login
  - [x] Consultar produtos
  - [x] Gerenciar estoque
  - [x] Visualizar histório de vendas (mensal, semanal, diário)
- [x] Os operadores de caixa poderão:
  - [x] Realizar login
  - [x] Consultar produtos
  - [x] Realizar vendar (lendo produtos com leito de código de barras)
  - [x] Realizar venda pela máquinha de cartão mercado pago
  - [x] Imprimir cupom eletrónico
- [x] Os clientes poderão:
  - [x] Consultar produtos disponíveis
  - [x] Entrar em contato com a loja pelo link do whatsapp
  - [x] Visualizar endereço da loja
        
---

## 🎨 Layout <a name="layout"></a>

### Login

PC             |  Mobile📱 
:-------------------------:|:-------------------------:
![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Login.png)  |  ![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Login%20Mobile.png)


### Produtos

PC             |  Mobile📱 
:-------------------------:|:-------------------------:
![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Tela%20deprodutos.png)  |  ![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Produtos%20Mobile.png)


### Caixa

Sem produtos           |  Com produtos
:-------------------------:|:-------------------------:
![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/CaixaLivre.png)  |  ![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Caixa%20com%20produtos.png)

### Área administrativa - Histórico de vendas

PC             |  Mobile📱 
:-------------------------:|:-------------------------:
![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Hist%C3%B3rico%20de%20venda%20%20com%20produt.png)  |  ![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Hist%C3%B3ricode%20vendaMobile.png)

### Área administrativa - Cadastro de produtos

PC             |  Mobile📱 
:-------------------------:|:-------------------------:
![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Cadastro.png)  |  ![](https://github.com/HenriqueSilvaIt/Assets/blob/main/l/Cadastro%20Mobile.png)

---

## 🚀 Como executar o projeto <a name="como-executar-o-projeto"></a>

Este projeto é divido em duas partes:
1. Frontend Web: https//github.com/HenriqueSilvaIt/LojinhaDoQuebraFrontEnd.git
2. Backend : https://github.com/HenriqueSilvaIt/LojinhaDoQuebraBackend.git

💡 Tanto o Frontend Web quanto o Mobile precisam que o Backend esteja sendo executado para funcionar

### Pré-requisitos <a name="pre-requisitos"></a>

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com)
[VSCode](https://code.visualstudio.com/).

#### 🎲 Rodando o Backend <a name="rodando-o-backend"></a>

```bash

# Clone este repositório
2. Backend : https://github.com/HenriqueSilvaIt/LojinhaDoQuebraBackend.git

# Acesse a pasta do projeto no terminal/cmd
$ cd LojinhaDoQuebraBackend

# Abra o projeto em uma IDE de preferencia
$ IntelliJ, Spring Boot Suite, Eclipse e etc.

# Instale as dependências
$  mvn clean

# Execute a aplicação em modo de desenvolvimento
$ dentro da IDE execute o projeto no botão RUN

# O servidor inciará na porta:8080 - acesse http://localhost:8080 

```

<p align="center">
  <a href="https://github.com/lucasbarzan/gobarber/blob/master/Insomnia_API_GoBarber.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</p>


#### 🧭 Rodando a aplicação web (Frontend) <a name="rodando-a-aplicacao-web-frontend"></a>

```bash

# Clone este repositório
$ git clone https: https//github.com/HenriqueSilvaIt/LojinhaDoQuebraFrontEnd.git

# Acesse a pasta do projeto no seu terminal/cmd
$ cd LojinhaDoQuebraFrontEnd

# Instale as dependências
$ yarn 

# Execute a aplicação em modo de desenvolvimento
$ yarn dev

# A aplicação será aberta na porta:5173 - acesse http://localhost:5173

```
---

## 🛠 Tecnologias <a name="tecnologias"></a>

As seguintes ferramentas foram usadas na construção do projeto:

-   **[ESLint](https://eslint.org/)**
-   **[Prettier](https://prettier.io/)**

#### **Server**  ([Java 17](https://nodejs.org/en/)) <a name="tecnologias-server"></a>

-   **[Spring boot](https://expressjs.com/)**
-   **[Railway](https://aws.amazon.com/pt/sdk-for-node-js/)**
-   **[PostGree](https://www.npmjs.com/package/bcryptjs)**
-   **[CORS](https://expressjs.com/en/resources/middleware/cors.html)**
-   **[Banco de dados H2](https://node-postgres.com/)**
- 
#### **Website**  ([React](https://reactjs.org/)  +  [TypeScript](https://www.typescriptlang.org/)) <a name="tecnologias-website"></a>

-   **[React Router Dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)**
-   **[Axios](https://github.com/axios/axios)**
-   **[TypeScript](https://github.com/jquense/yup)**
-   **[HTML](https://www.npmjs.com/package/uuidv4)**
-   **[CSS](https://date-fns.org/)**

#### **Utilitários** <a name="utilitarios"></a>

-   Editor:  **[Visual Studio Code](https://code.visualstudio.com/)**
-   Teste de API:  **[Insomnia](https://insomnia.rest/)**

---

## 🦸 Autor <a name="autor"></a>

<a href="https://github.com/HenriqueSilvaIt">
 <img src="https://github.com/HenriqueSilvaIt/Assets/blob/main/l/fil.jpeg" width="100px" alt="Henrique Silva" />
 <br />
 <sub><b>HenriqueSilva</b></sub></a>
 <br />

[![Linkedin Badge](https://img.shields.io/badge/-HenriqueSilva-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://https://www.linkedin.com/in/henriqueoliveirati)](https://www.linkedin.com/in/henriqueoliveirati/) 
[![Gmail Badge](https://img.shields.io/badge/-henriqueoliveiraaa@yahoo.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:lucasbarzand@gmail.com)](mailto:henriqueoliveiraaa@yahoo.com)

---

## 📝 Licença <a name="licenca"></a>

Este projeto esta sob a licença [MIT](./LICENSE).

Desenvolvido por Henrique Silva 👋🏽 [Entre em contato!](https://www.linkedin.com/in/henriqueoliveirati)
