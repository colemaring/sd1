# AI for Safe Driving

## CI/CD workflow:

1. Clone the repo

```bash
git clone https://github.com/colemaring/sd1.git
```

2. Install NPM packages in /server and /client

```bash
npm install
```

3. In the server folder (recommend using nodemon)

```bash
npm start
```

4. In the client folder

```bash
npm run dev
```

5. Updating website

```bash
npm run build
git add .
git commit -m "message"
```

Running server for development

```bash
node server.js dev
```

- Server is updated on changes to /client/dist <br>

## TODO:

install postgres and connect to express <br>
create express api routes for interacting with database <br>
populate dummy data for testing routes and frontend <br>
