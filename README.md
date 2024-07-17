<div align="center">
  <h1>Content</h1>
</div>

#### Table of Contents

- [About The Project](#-about-the-project)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup Database & env](#setup-database--env)
  - [Run project for local development](#run-project-for-local-development)
  - [Run on Production](#run-on-production)
  - [Run test](#run-test)
  - [Seed Dummy data](#seed-dummy-data)

### 📍 About The Project

This repo demonstrate how you can build Parking Spot booking api using Clean Architecture with Node.js, Express and Postgresql.

### 🚀 Getting Started

To get a local copy up and running, follow these simple example steps.

### Prerequisites

- Nod.js `v20.12.0`
- docker-compose or postgresql

### Setup Database & env

> If you have already installed Postgresql on your machine. you can create database `spot_booking` and skip this step.

- use docker-compose to run database. Open root of the project in terminal and run this command

  ```
  docker-compose up
  ```

- Rename `.env.example` to `.env` and update the `DATABASE_URL`

  ```
  DATABASE_URL="postgresql://postgres:password@0.0.0.0:5432/spot_booking?schema=public"
  ```

### Run project for local development

- Install Dependencies `npm install`

- Setup .env as previously mentioned

- Run database migration `npm run migrate`

- Seed dummy data into database `npm run seed`

- Start server `npm run dev`

- visit http://localhost:8000

### Run on Production

- `npm run build`

- `npm start`

### Run test

To run test cases `npm run test`

### Seed Dummy data

If you have seeded data as mentioned previously. You will have following data in database

**Users**

| **userId** | **name** | **role** | **token** |
| ---------- | -------- | -------- | --------- |
| user-1     | vinay    | admin    | token-1   |
| user-2     | shivam   | standard | token-2   |
|            |          |          |           |

**Parking Spot**
| **spotId** | **name** |
|------------|----------|
| abc-1 | spot_one |
| abc-2 | spot_two |
