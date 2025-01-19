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

3. In the server folder (recommend using nodemon for hot reloads)

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

Running the websockets client test script (to simulate a connected vehicle)

```bash
python client_test.py
```

- Server is updated on changes to /client/dist <br>

## TODO:
connect APIs for fetching user data and historical data when loading page <br>
