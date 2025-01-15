# This file serves as an example of how to connect to the WebSockets endpoint
# as of 1/14/24, the data is just rendered at https://aifsd.xyz/wstest

import asyncio
import websockets
import random
import json
from datetime import datetime

timeoutSeconds = 0.5

async def connect():
    uri = "wss://aifsd.xyz"
    async with websockets.connect(uri) as websocket:
        print("Connected to the server")

        while True:
            # Generate dummy data
            data = {
                "Timestamp": datetime.utcnow().isoformat() + "Z",
                "Driver": "John Doe",
                "Drinking": random.choice([True, False]),
                "Eating": random.choice([True, False]),
                "Phone": random.choice([True, False]),
                "SeatbeltOn": random.choice([True, False]),
                "Sleeping": random.choice([True, False]),
                "Smoking": random.choice([True, False]),
                "handsOnWheel": random.choice([0, 1, 2]), # how many hands are currently on the wheel
            }

            # Convert the data to JSON string
            json_data = json.dumps(data)

            # Send the JSON data to the server
            await websocket.send(json_data)
            print("Sent message to server")

            # for debugging, not needed
            # response = await websocket.recv()
            # print(f"Received from server: {response}")

            await asyncio.sleep(timeoutSeconds)

# Run the connect function
asyncio.get_event_loop().run_until_complete(connect())
