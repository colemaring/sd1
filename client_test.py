import asyncio
import websockets
import random
import json
from datetime import datetime

numMessages = 40 # Number of messages to send (exists to simulate first/last flags)
timeoutSec = 0.3 # Time to wait between generating new data

async def generate_data():
    return {
        "Timestamp": datetime.utcnow().isoformat() + "Z", 
        "Driver": "Steven Darrell",
        "Phone": "0101012222",
        "Drinking": random.choices([True, False], weights=[1, 15])[0],
        "Eating": random.choices([True, False], weights=[1, 15])[0],
        "OnPhone": random.choices([True, False], weights=[1, 5])[0],
        "SeatbeltOff": random.choices([True, False], weights=[1, 50])[0],
        "Sleeping": random.choices([True, False], weights=[1, 50])[0],
        "Smoking": random.choices([True, False], weights=[1, 30])[0],
        "OutOfLane": random.choices([True, False], weights=[1, 30])[0],
        "RiskyDrivers": random.choices([3, 2, 1, 0], weights=[5, 5, 5, 85])[0],
        "UnsafeDistance": random.choices([True, False], weights=[1, 30])[0],
        "HandsOffWheel": random.choices([True, False], weights=[1, 30])[0],
        "FirstFlag": False,
        "LastFlag": False,
    }

async def connect():
    # use ws://localhost:8080 if local
    # wss://aifsd.xyz for deployed
    uri = "wss://aifsd.xyz"
    global eventFrequencies

    async with websockets.connect(uri) as websocket:
        print("Connected to the server")
        messageCount = 0
        prevData = {}
        
        while messageCount < numMessages:
            data = await generate_data()

            # Only send data if it has changed
            messageCount += 1
            data["FirstFlag"] = messageCount == 1
            data["LastFlag"] = messageCount == numMessages

            # Send data to server   
            await websocket.send(json.dumps(data))
            print("Sent message to server")
            await websocket.recv() # Tells ws server we still exist

            await asyncio.sleep(timeoutSec)
        
        print ("Sent " + str(messageCount) + " messages, ending program.")

# Run the connect function
print("Running emulator script for " + str(numMessages) + " messages.")
asyncio.get_event_loop().run_until_complete(connect())
