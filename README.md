# Secure File Sharing API

## Overview

This API provides a secure file-sharing service with features such as file upload, download, encryption, access verification, and user authentication. It uses Mongoose for database interactions and bcrypt for password hashing and crypto for file encryption. The service ensures secure file management by encrypting file data and restricting access through user authentication and metadata validations.

## Features

- #### User Authentication:
   User can register and login with JWT authentication

- #### File Encryption: 
   Files are stored securely using advanced encryption algorithm

- #### Access Control: 
   Authenticated users can access files using passwords.

- #### Download Restrictions:
   Files have expiration time and maximum download limit

- #### Access Logs: 
   Tracks file sharing, downloading, and updating activities and keeps the logs stored in the database

## Endpoints

### User Management

- #### Register a User

    Endpoint: POST api/users/register
      
      Request Body:
      ```json
      {
      "name": "Arun",
      "email": "arun123@example.com",
      "password": "test1234"
      }
      ```

      Response:

      success: {success:true, token}
      failure: User already exists or weak password.

- #### Login a User

  Endpoint: POST api/users/login

      Request Body:

      {
      "email": "arun123@example.com",
      "password": "test1234"
      }

      Response:

      success: {success:true, token}
      failure: Invalid credentials.

### File Management

- #### Upload a File

  Endpoint: POST /files/upload

  Headers:

  Authorization: Bearer <JWT>

      Request Body:

      {File (binary data)

      Metadata:

      {
       "expiry": 24, // in hours
       "maxDownloads": 5,
       "password": "test1234" //optional
      }

      Response:

      success:{"sucess": true, "message": "File uploaded successfully",fileId}
      failure: Validation errors or server issues.

- #### Verify File Access

  Endpoint: POST /files/:fileid/access

  Headers:

  Authorization: Bearer <JWT>

      Request Body:

      {
      "password": "test1234"
      }

      Response:

      success: {"success": true, "message": "File Access successfully verified"}
      failure: File not found, incorrect password, or expired file.

- #### Download a File

  Endpoint: GET /files/:fileid/download

  Headers:

  Authorization: Bearer <JWT>

      Response:

      success: Returns the decrypted file.
      failure: File not found, access denied, or download limit exceeded.

- #### Update a File

  Endpoint: PUT /files/:fileid

  Headers:

  Authorization: Bearer <JWT>

      Request Body:

      File (binary data)

      Metadata:

      {
      "password": "test1234"
      }

      Response:

      success: {"success": true,"message": "File Successfully Updated"}
      failure: Validation errors or server issues.



## Technologies Used

- #### node.js: Backend runtime.

- #### express.js: Framework for building the API.

- #### mongoose: Database storage

- #### bcrypt: For hashing passwords for secure storage.

- #### crypto: For file encryption and decryption.

- #### jsonwebtoken: For authentication


## Installation

Clone the repository:

    git clone <repository-url>

Install dependencies:

    npm install

Set up environment variables in .env file:

    PORT=<port_number>
    MONGO_URL=<mongoose_database_url>
    JWT_SECRET=<jwt_secret>
    EXPIRESIN=<token_expiry_time>

#### Generate Secret key for encryption in key.js file in utils folder

Set up the key in .env file

    SECRET_KEY=<secret_key>

Start the server:

    npm run server

## Error Handling

- Proper error responses are returned with appropriate messages

- Logs errors to the console for debugging.

## Security Features

- Passwords are hashed using bcrypt.

- File data is encrypted with AES-256 algorithm using the crypto module.

- Authentication tokens are securely generated with JWT module.
