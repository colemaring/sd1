# This file serves as an example of how to connect to the WebSockets endpoint
# as of 1/14/24, the data is just rendered at https://aifsd.xyz/wstest

import asyncio
import websockets
import random
import json
from datetime import datetime

timeoutSeconds = 1

async def connect():
    uri = "wss://aifsd.xyz"
    async with websockets.connect(uri) as websocket:
        print("Connected to the server")

        while True:
            # Generate dummy data
            data = {
                "Timestamp": datetime.utcnow().isoformat() + "Z", 
                "Driver": "John Doe",
                "Drinking": random.choices([True, False], weights=[1, 15])[0],
                "Eating": random.choices([True, False], weights=[1, 15])[0],
                "Phone": random.choices([True, False], weights=[1, 5])[0],
                "SeatbeltOff": random.choices([True, False], weights=[1, 50])[0],
                "Sleeping": random.choices([True, False], weights=[1, 50])[0],
                "Smoking": random.choices([True, False], weights=[1, 30])[0],
                "OutOfLane": random.choices([True, False], weights=[1, 30])[0],
                "RiskyDrivers": random.choices([3, 2, 1, 0], weights=[5, 5, 5, 85])[0],
                "UnsafeDistance": random.choices([True, False], weights=[1, 30])[0],
                "HandsOnWheel": random.choices([2, 1, 0], weights=[90, 8, 1])[0],
            }

            json_data = json.dumps(data)
            await websocket.send(json_data)
            print("Sent message to server")

            # needed to serve as a ping mechanism
            await websocket.recv()
            await asyncio.sleep(timeoutSeconds)

# Run the connect function
asyncio.get_event_loop().run_until_complete(connect())
