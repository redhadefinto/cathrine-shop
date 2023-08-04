<div align="center">
  <div style="display: flex; justify-content: center; align-items: center">
    <!-- <img width="50" src="./public/logo.png" alt="display-documentation">   -->
  
  <h2 style="margin-top: 30px; margin-left: 10px"> 
  
  **Klontong Api**
  
  </h2>
  </div>
  
  <br>

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

<br>

---

# **Introduction**

"KlontongAPI is a revolutionary application that presents an unforgettable shopping experience. With the help of API Be, which moves agilely, KlontongAPI makes it easy and fun to explore various stores and find the best products for your needs. Enjoy safe and comfortable shopping with advanced features that designed to provide an unparalleled shopping experience. Make KlontongAPI your loyal friend in finding special offers, keeping up with the latest trends, and finding everything you need at hand. With KlontongAPI, shopping becomes more fun and refreshing!"

---

## 𓆙 Requirement

This repo require a [NodeJS](https://nodejs.org/)

## 𓆙 Windows Installation

First of all, you need to install [Git](https://git-scm.com/download/win) & [NodeJS](https://nodejs.org/). Then open your git bash, and follow this:<br>

```sh
$ https://github.com/redhadefinto/klontong-be
$ cd klontong-be
$ code .
$ npm i
```

## 𓆙 Linux Installation

```sh
$ apt-get update
$ apt-get install git-all
$ apt-get install nodejs-current
$ https://github.com/redhadefinto/klontong-be
$ cd klontong-be
$ code .
$ npm i
```

## 𓆙 How to run

1. Install file using [WINDOWS](#Windows-Installation) OR [LINUX](Linux-Installation)

2. Add .env file at root folder, and add following

```sh
DB_HOST = "YOUR HOST"
DB_NAME = "YOUR DB NAME"
DB_PORT = "YOUR DB PORT"
DB_USER = "YOUR DB USER"
DB_PWD = "YOUR DB PASSWORD"
SERVER_PORT = "YOUR LOCALHOST"

JWT_SECRET = "YOUR SECRET JWT"

MAIL_EMAIL = "YOUR EMAIL"
MAIL_PASSWORD = "YOUR PASSWORD"

CLOUD_NAME = "YOUR CLOUDNAME"
CLOUD_KEY = "YOUR KEY CLOUD"
CLOUD_SECRET = "YOUR KEY SECRET CLOUD "
```

3. Starting application

```sh
$ npm run dev
```

## 𓆙 Route

| Endpoint             |    Method    | Info         | Remark                          |
| -------------------- | :----------: | :----------- | :------------------------------ |
| /auth                |    `POST`    | Auth         | Login                           |
| /auth/logout         |   `PATCH`    | Auth         | LOGOUT                          |
| /auth/register       |    `POST`    | Auth         | Register                        |
| /auth                |   `PATCH`    | User         | Change Password                 |
| /auth/verify         |   `PATCH`    | User         | Verify Account                  |
| /auth/otp            |   `PATCH`    | User         | get otp                         |
| /auth/forgot         |   `PATCH`    | User         | fotgot password                 |
| /transactions        |    `GET`     | Transactions | History Transaction             |
| /transactions        |    `POST`    | Transactions | Create Transaction              |
| /transactions        |   `DELETE`   | Transactions | Delete Transaction              |
| /transactions        |   `PATCH`    | Transactions | status Transaction done (admin) |
| /products            | `POST` `GET` | Products     | Create and See Products         |
| /products/:id        |    `GET`     | Products     | Get detail product              |
| /products/:productId |   `PATCH`    | Products     | Edit product                    |
| /products/:id        |   `DELETE`   | Products     | Delete product                  |
| /profile             |    `GET`     | Profile      | Get Profile                     |

## Deployment

<br>

Project Link: [KLICK](https://klontong-be.vercel.app/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 𓆙 Documentation Postman

<br>

Download json [POSTMAN](https://api.postman.com/collections/22450553-a2991285-b59b-43dd-9b8d-1bf4f1e7dcfe?access_key=PMAT-01H6ZYAE7A6NF2W7Y04A407QSB)

<BR>
<BR>

## 𓆙 Related-Project

- [FRONT-END](https://github.com/redhadefinto/klontong-fe)

## 𓆙 Contributor

  <table>
    <tr>
      <td >
        <a href="https://github.com/redhadefinto">
          <img width="100" src="https://avatars.githubusercontent.com/u/66767762?s=400&u=00ad08bd394a1ba0fe65d9b61cbef4245df96fb4&v=4" alt=""><br/>
          <center><sub><b>Redha Definto </b></sub></center>
        </a>
        </td>
    </tr>
  </table>
<h1 align="center"> THANK FOR YOUR ATTENTION </h1>
