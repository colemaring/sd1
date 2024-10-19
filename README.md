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

3. Change API key in Maps.jsx

```java
googleMapsApiKey: "YOUR API",
```

4. In the server folder (recommend using nodemon)

```bash
npm start
```

5. In the client folder

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

## Troubleshooting:
![Screenshot 2024-10-19 130636](https://github.com/user-attachments/assets/b873ad45-a759-41b4-8997-4eb863241c1f)<br>
This *RefererNotAllowedMapError* error indicates your IP is not whitelisted to use the Maps API key in Maps.jsx<br>
By default only aifsd.xyz is allowed to use the key listed in Maps.jsx<br>
The best course of action for removing the error for development is to get your own key<br>


## Notes:

It's ok to expose Maps API because it's restricted to aifsd.xyz <br>
