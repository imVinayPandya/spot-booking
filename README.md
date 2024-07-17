<div align="center">
  <h1>Book Parking Sport</h1>
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
- [List of Test Cases](#-list-of-test-cases)
  - [Create Booking](#bookingcontroller-oncreatebooking)
  - [Get Booking](#bookingcontroller-ongetbooking)
  - [Update Booking](#bookingcontroller-onupdatebooking)
  - [Delete Booking](#bookingcontroller-ondeletebooking)
- [Todos](#todos-things-can-be-done)

<hr />

### 📍 About The Project

This repo demonstrate how you can build Parking Spot booking api using Clean Architecture with Node.js, Express and Postgresql.

### 🚀 Getting Started

To get a local copy up and running, follow these simple example steps.

#### Prerequisites

- Nod.js `v20.12.0`
- docker-compose or postgresql

#### Setup Database & env

> If you have already installed Postgresql on your machine. you can create database `spot_booking` and skip this step.

- use docker-compose to run database. Open root of the project in terminal and run this command

  ```
  docker-compose up
  ```

- Rename `.env.example` to `.env` and update the `DATABASE_URL`

  ```
  DATABASE_URL="postgresql://postgres:password@0.0.0.0:5432/spot_booking?schema=public"
  ```

#### Run project for local development

- Install Dependencies `npm install`

- Setup .env as previously mentioned

- Run database migration `npm run migrate`

- Seed dummy data into database `npm run seed`

- Start server `npm run dev`

- visit http://localhost:8000

#### Run on Production

- `npm run build`

- `npm start`

#### Run test

To run test cases `npm run test`

<hr />

### Seed Dummy data

- `npm run seed` to seed dummy data into database and You will have following data in your database

**Users**

| **userId** | **name** | **role** | **token** |
| ---------- | -------- | -------- | --------- |
| user-1     | vinay    | admin    | token-1   |
| user-2     | shivam   | standard | token-2   |

**Parking Spot**
| **spotId** | **name** |
|------------|----------|
| abc-1 | spot_one |
| abc-2 | spot_two |

<hr />

### 🤖 List of test cases

###### BookingController onCreateBooking

- [x] should return 400 if request body is invalid
- [x] should return 400 if endDateTime should be greater than startDateTime
- [x] should return 403 if standard user tries to create booking for other users
- [x] should return 409 if booking already exists for the given parking spot and time
- [x] should return PrismaClientKnownRequestError if parkingSpot or forUserId is does not exist in DB (52 ms)
- [x] should return 201 if booking is created successfully

###### BookingController onGetBooking

- [x] should return 200 and should do DB query with Offset=0, limit=2
- [x] Should return 200 and return all bookings for Admin user
- [x] Should return 200 and return bookings of standard user

###### BookingController onUpdateBooking

- [x] should return 409 if booking already exists for the given parking spot and time
- [x] should return 404 if booking does not exist in DB (3 ms)
- [x] should return 400 if request body is invalid
- [x] should return 403 if standard user tries to update other user's booking
- [x] should return 200 if booking is updated successfully

###### BookingController onDeleteBooking

- [x] should return 400 if bookingId not found in request params
- [x] should return 404 if booking not found in database
- [x] should return 403 if standard user tries to delete other user's booking
- [x] should return 200 if booking is deleted successfully

<hr />

### TODOs: (Things can be done)

My initial goal is to keep my focus on creating api with business requirement.
I have listed few Todo or things can be done differently

- [ ] Docker for Node.js app
- [ ] Different error handler for httpError, Database error, validation error
- [ ] Unified response object (for error & success)
- [ ] implement intigretion test
- [ ] Improve folder structure
- [ ] Api versioning
