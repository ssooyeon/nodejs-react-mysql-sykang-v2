# What this project provides

## server (nodejs)

1. crud api
2. local system monitoring logic

## client (reactjs)

1. default template
2. register & login & logout
3. crud function
4. system monitoring chart
5. calendar management
6. redux & store

# setting project

## server database config

1. create <mark>.env.dev</mark> file and <mark>.env.prod</mark> file in root folder.
2. in <mark>.env.dev</mark>, enter the following below.

```
DB_HOST=localhost
DB_USER=root      #your local database username
DB_PASSWORD=1234  #your local database password
DB_NAME=my_blog   #your local database name
DEPLOY_SERVER_URL=
```

3. in <mark>.env.prod</mark>, enter the following below.

```
DB_HOST=#server database usename
DB_USER=#server database username
DB_PASSWORD=#server password
DB_NAME=#server database name
DEPLOY_SERVER_URL=#server url
```

## client api url config

1. create <mark>.env.development</mark> file and <mark>.env.production</mark> file in /client folder.
2. in <mark>.env.development</mark>, enter the following below.

```
REACT_APP_API_HOST=http://localhost:8081/api
```

3. in <mark>.env.production</mark>, enter the following below.

```
REACT_APP_API_HOST=/api
```

# start project

## server install

```
npm install
```

## client install

```
cd client
npm install
```

## start

```
npm run dev
```

# others

N/A

## to more information

1. If you want to see a project that's simpler than this one, visit *https://github.com/ssooyeon/nodejs-react-mysql-basic-v2*. Same as this project, task & calendar management page is excluded.

2. If you want to see other templates with similar features, visit below.

```
another simpler template:
*https://github.com/ssooyeon/nodejs-react-mysql-basic*
another detailed template:
*https://github.com/ssooyeon/nodejs-react-mysql-sykang*
```
