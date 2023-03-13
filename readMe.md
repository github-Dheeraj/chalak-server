// Google Login Info shared
{
    "given_name": "dheeraj",
    "family_name": "borde",
    "nickname": "bordedheeraj.7",
    "name": "dheeraj borde",
    "picture": "https://lh3.googleusercontent.com/a/AGNmyxbYCIzx5Kpo_bn9XueViFzNfP-IZ7y42fhQzF-c=s96-c",
    "locale": "en",
    "updated_at": "2023-03-08T06:39:44.951Z",
    "email": "bordedheeraj.7@gmail.com",
    "email_verified": true,
    "sub": "google-oauth2|114704458568576628992",
    "sid": "RJ5CTEUakKvP58WHUhFwWfQRQrVH-zIV"
}

{
    "given_name": "Dheeraj",
    "family_name": "Borde",
    "nickname": "bordedheeraj.77",
    "name": "Dheeraj Borde",
    "picture": "https://lh3.googleusercontent.com/a/AGNmyxZy9qVNdoQGhcEzpbp4s861YnIXF9T9AzWq8fobIg=s96-c",
    "locale": "en",
    "updated_at": "2023-03-08T06:51:52.731Z",
    "email": "bordedheeraj.77@gmail.com",
    "email_verified": true,
    "sub": "google-oauth2|118296565019402995628",
    "sid": "Ryjk2TzhQjJcQe_zZnBxjpX8qJfke9_E"
}

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Property {
  id          Int      @id @default(autoincrement())
  sellerId    Int
  listedAt    DateTime @default(now())
  title       String   @db.VarChar(255)
  description String?
  cost        Int
  deposit     Int?
  tags        String[]
  User        User?    @relation(fields: [userId], references: [id])
  userId      Int?
}

model Seller {
  id               Int          @id @default(autoincrement())
  createdAt        DateTime     @default(now())
  name             String
  phone            String?      @unique
  email            String       @unique
  photoUrl         String?
  socialLinks      socialLink[]
  tags             String[]
  businessId       String?      @unique
  googleId         String?      @unique
  messagesRecieved message[]
}

// model Bookmark {
//   id         Int @id @default(autoincrement())
//   userId     Int
//   propertyId Int
// }

model message {
  id         Int      @id @default(autoincrement())
  propertyId Int
  userId     Int
  sendAt     DateTime @default(now())
  name       String
  userPhone  String
  message    String?
  User       User?    @relation(fields: [userId], references: [id])
  Seller     Seller?  @relation(fields: [sellerId], references: [id])
  sellerId   Int?
}

model socialLink {
  id       Int
  name     String
  url      String  @unique
  userId   Int
  User     User    @relation(fields: [userId], references: [id])
  Seller   Seller? @relation(fields: [sellerId], references: [id])
  sellerId Int?
}

model User {
  id                  Int          @id @default(autoincrement())
  createdAt           DateTime     @default(now())
  name                String
  phone               String?      @unique
  email               String       @unique
  googleId            String       @unique
  photoUrl            String?
  socialLinks         socialLink[]
  intrestedProperties Property[]
  sentMessages        message[]
}
