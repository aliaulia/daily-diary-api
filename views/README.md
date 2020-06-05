# Update
Project under development

# Daily Diary API
Daily Diary API is a mini project to storing diary by date entries with RESTFUL API. 

## Requirement
- Apache Server

## Deployment
1. First, make sure to Import diary_daily_db.sql to phpmyadmin

# How It Works
Daily Diary contain a list of API. the API include authentication and session system. To maximize the API, first you should pass the authentication.

All the APIs is integrated with session system. Session system will be explained in the section below.

## Session
In this project, user will get session token everytime he sign in with login API. Everytime user request to the server, it will check your session if your session it still valid or not. A user session become invalid when the same user is signed in on another device.
    
    In other words, a user can only have 1 active session at one time.

There are 2 type of session handler

1. **Forbidden** : an user who not signed in frist (re: guest user) request to server is not have a session saved on memory.
2. **Session Removed** : a session has been removed due to an sign in activities of the same user in other device.



