# This file serves as an example of how to connect to the WebSockets endpoint
# as of 11/13/24, the data is just rendered at https://aifsd.xyz/wstest

import asyncio
import websockets
import random
import json
from datetime import datetime

async def connect():
    uri = "wss://aifsd.xyz"
    async with websockets.connect(uri) as websocket:
        print("Connected to the server")

        while True:
            # Generate dummy data
            data = {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "driver": "John Doe",
                "var1": random.choice([True, False]),
                "var2": random.choice([True, False]),
                "var3": random.choice([True, False]),
                "var4": random.choice([True, False]),
                "var5": random.choice([True, False]),
                "var6": random.choice([True, False]),
                "var7": random.choice([True, False]),
                "var8": random.choice([True, False]),
                "var9": random.choice([True, False]),
                "var10": random.choice([True, False]),
                "handsOnWheel": f"{random.randint(10000, 30000)}ms",
                "handsOffWheel": f"{random.randint(100, 1000)}ms"
            }

            # Convert the data to JSON string
            json_data = json.dumps(data)

            # Send the JSON data to the server
            await websocket.send(json_data)
            print(f"Sent to server: {json_data}")

            # Receive a message from the server
            response = await websocket.recv()
            print(f"Received from server: {response}")

            # Wait for 3 seconds before sending the next data
            await asyncio.sleep(3)

# Run the connect function
asyncio.get_event_loop().run_until_complete(connect())
