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

3. Change API on Maps.jsx or send me your IPV4 and I can whitelist you

```java
googleMapsApiKey: "YOUR API",
```

4. In the server folder (recommend using nodemon)

```bash
npm start
```

5. In the cliend folder

```bash
npm run dev
```

6. Updating website

```bash
npm run build
git add .
git commit -m "message"
```

- Server is updated on changes to /client/dist <br>

## TODO:

allow routing <br>
install postgres and connect to express <br>
create express api routes for interacting with database <br>
populate dummy data for testing routes and frontend <br>

## Notes:

It's ok to expose Maps API because it's restricted to aifsd.xyz <br>
