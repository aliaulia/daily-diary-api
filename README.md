# Daily Diary API
Daily Diary API is a mini project to storing diary by date entries with RESTFUL API. 

## Deployment
1. First, make sure to Import diary_daily_db.sql to phpmyadmin on server or localhost.
2. Deploy root folder to server or localhost.
3. on the terminal, type `npm start` to start API.

# How It Works
Daily Diary contain a list of API. the API include authentication and session system. *Given an asumption the API is used on closed environment system*, To make all the APIs work, first you should pass the authentication (yes, this system have an authentication API).

User must log to the system first because all the APIs are integrated with session system. Session system will be explained in the section below.


## Session
In this project, user will get session token everytime he sign in with login API. Everytime user send a request to the server, system will check your session if your session is still valid or not. A user session become invalid when the same user is signed in on another device. The one who get the access is the latest user who log into the system.

    
    In other words, a user can only have 1 active session at one time.

There are 2 type of session handler : 

1. **Forbidden** : an user who not signed in frist (re: guest user) request to server is not have a session saved on memory.
2. **Session Removed** : a session has been removed due to an sign in activities of the same user in other device.

## Project page
In project, there are available page to try the api. the Available pages are explaied below.

- `/ ` : index page, show login form to log into the system
- `/register` : register page, show register form to insert new user
- `/diary` : diary page, show diary form to save a diary

# Test Case
In root folder, you can try some test case in [request.rest](/request.rest). Try these test cases with visual [studio code](https://code.visualstudio.com/Download) and plugin [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).
