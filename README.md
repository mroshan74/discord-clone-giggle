# discord-clone-giggle
Clone of discord app with minimilistic features

# Giggle - Discord Clone
[![Build Status](https://i.imgur.com/l5raReV.png)](https://giggle-app.herokuapp.com/)
# Overview
This app showcases minimilistic features of discord such as: 
  - Message Chatting
  - Video Calling using peer2peer technology of webRTC
  - Social Media 
> CRUD operation performed on application state in front-end
> and in the database on backend where it is stored in the cloud.
> 
> This app implements user authentication and authorization
> and is build with MVC architecture which scalable in future.

## Packages Used
    @material-ui/core
    bcryptjs 
    crypto-js
    express
    hash
    jsonwebtoken
    mongoose
    morgan
    multer
    nodemon
    socket.io
    uuidv4
    validator
    axios
    classnames
    emoji-mart
    formik
    moment
    query-string
    react
    react-dom
    react-dropzone
    react-icons
    react-redux
    react-router-dom
    redux
    redux-thunk
    simple-peer
    socket.io-client
    yup
    uuid

### Installation
Install the dependencies and devDependencies and start the server.

```sh
$ npm install
```

## Folder structure

```bash
├───app
│   ├───controllers
│   ├───middlewares
│   └───models
├───client
│   ├───public
│   └───src
│       ├───components
│       │   ├───chat-box
│       │   │   ├───container-main
│       │   │   └───grid-components
│       │   │       ├───chat-form
│       │   │       ├───chat-title
│       │   │       ├───chats
│       │   │       │   ├───chat-item
│       │   │       │   ├───chat-list
│       │   │       │   ├───chat-search
│       │   │       │   ├───new-chat
│       │   │       │   └───no-chat
│       │   │       └───message
│       │   ├───general
│       │   │   └───nav-bar
│       │   │       └───_reuse
│       │   ├───posts
│       │   ├───register-login
│       │   ├───reusables
│       │   ├───search
│       │   ├───socket-listeners
│       │   └───video-call
│       ├───redux
│       │   ├───actions
│       │   ├───reducers
│       │   └───store
│       ├───resources
│       │   ├───bg
│       │   └───icons
│       ├───services
│       └───styles
│           ├───assets
│           └───icons
├───config
├───resources
│   └───images
└───uploads
```
### Todos

 - Write MORE Tests
 - Add Comment to post 

License
--- ISC
