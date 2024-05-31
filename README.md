# Northcoders News API


[Link to Live Website](https://nc-news-project-hvpy.onrender.com/api)

This project is an API that accesses application data programmatically. The intention is to mimic backend service which provides information the front end architecture, using SQL queries and requests. The live site will initially show all available nedpoints and any of them can be used to retrieve the relevant data for that query. 

Installation instructions:
- Fork and clone this repo
- Install Express, Supertest, jest-sorted, pg and dotenv. Install jest as a dev-dependency to ensure tests run smoothly.
- To run files first run 'npm setup-dbs', followed by 'npm seed' to setup and seed the database. Run 'npm test' to run and view the util and api tests
- Create two .env files (one will be .env.development and the other .env.test)and into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).
- Minimum Versions of Node and Postgres required are node v21.7.1 and postgres 3.4.4


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
