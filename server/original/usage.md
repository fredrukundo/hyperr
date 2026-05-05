use docker compose start each service along:

1st service to run should be the database
2nd service to run should be backend 

i still need to configure the nginx , in case you could configure it that will be good

after service start enter the backend Container terminal and do :

npm install 

npm install nodemon -g

nodemon app.js 

at this point you should see 

[OK] -> initUsersDBTable
[OK] -> initPasswordResetDBTable
[OK] -> initMoviesDBTable
[OK] -> initCommentsDBTable
Server running on port: 8000

from your os access : http://127.0.01:7002

