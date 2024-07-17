We need to develop a Node.js service that enables users, based on their permission level (admin
or standard), to perform CRUD operations for parking spot bookings.

- Admin users can create bookings and can get/edit/delete any existing booking.
- Standard users can create new bookings and can get/edit/delete only the bookings they have created themselves.

Create REST API endpoints to manage all the operations mentioned above.
There is no need to create a user registration process; users can be manually added to the
database. Additionally, for simplicity, user authentication will be done solely through an API token
(no login, sessions, etc.).
