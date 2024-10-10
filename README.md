# CI/CD workflow: 
clone repo <br>
npm install in /server & /client <br>
you'll have to change the Maps API to either your own or send me your IPV4 and I can whitelist you <br>
npm run dev in /client (for dev frontend server) <br>
npm start in /server (for dev express server) <br>
npm run build (to create dist) <br>
upload dist into /server on repo, and server will update to new changes <br>
 - Server is updated on changes to /server/dist <br>
 
# notes:
It's ok to expose Maps API because it's restricted to aifsd.xyz <br>
