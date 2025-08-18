# 🚀 Technical Assessment Challenge - Apply Digital

Welcome to my **Products API** solution!  
This project demonstrates a clean architecture, modular design, and solid backend practices. 😎

---
## About the challange

We are building an API to fetch product information from an external service on an hourly basis. The API will expose both public and private endpoints:

Public endpoints: Provide general product information accessible to all users.

Private endpoints: Deliver detailed reports and sensitive product data for authorized users only.

---
## Stack

<img width="600" height="600" alt="44e172d3-30a7-4620-a325-7b0fd95dfc23" src="https://github.com/user-attachments/assets/f0c9528f-d909-40b3-9fb3-989d4b82cbd6" />

---
## 🏗 Architecture Overview

The project follows a **modular, layered architecture**:


- **Controllers** handle incoming requests and responses. 📩  
- **Services** contain business logic and orchestrate operations. 🔧  
- **Repositories & API Clients** interact with the database and external services. 💾  
- **Tasks** handle scheduled operations or background jobs. ⏱️  

This design ensures **scalability**, **testability**, and **maintainability**. ✨

---

## 🗂 Database

For the database, I chose PostgreSQL over Mongoose. While I’m also proficient with MongoDB, I wanted to highlight my SQL skills for this demo.

For simplicity, this demo uses only a single table.

<img width="200" height="400" alt="Table ER" src="https://github.com/user-attachments/assets/63f3a4a7-0ce0-4c8a-8d83-80b959ccdb84" />

---
## 🔐 Auth

For authentication, this demo uses the Passport library. Since the authentication is simple, you only need to include an Authorization header with a token. 
You can obtain a token from the public endpoint: `/auth/get-token`

--- 
## Comments and considerations

One of the main requirements is to fetch data every hour. That’s great for production, but for demo and development purposes, I’ve added an environment variable to control the interval.  

By default, it’s set to fetch every **10 seconds** to make testing easier. You can adjust it using the `CONTENTFUL_FETCH_INTERVAL` variable, either in the `docker-compose.yml` file or in your `.env` file.  

I’d recommend leaving it as-is unless you have a specific reason to change it.


---
## 🚀 Running the Project

Let’s get started!  

I’ve made it super simple — just run:  

docker-compose up -d


## Running Outside Docker

If you prefer to run the project without Docker, you can set the following environment variables. The app will work smoothly with them:

```dotenv
## Database
DATABASE_HOST=db.rtpvacxygpuhvxojnknt.supabase.co
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=superstrongPassword
DATABASE_NAME=postgres
# Contentful API
CONTENTFUL_BASE_URL=https://cdn.contentful.com/spaces/
CONTENTFUL_SPACE_ID=9xs1613l9f7v
CONTENTFUL_ACCESS_TOKEN=I-ThsT55eE_B3sCUWEQyDT4VqVO3x__20ufuie9usns
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_CONTENT_TYPE=product
CONTENTFUL_FETCH_INTERVAL=*/10 * * * * *  # Every 10 seconds
JWT_SECRET=superSecretAndSecure
JWT_EXPIRES_IN=1d







