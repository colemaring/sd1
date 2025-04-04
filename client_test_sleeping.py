import asyncio
import websockets
import random
import json
from datetime import datetime

numMessages = 2  # Only one message to test sleeping event
timeoutSec = 1  # Unchanged, but irrelevant for a single message

async def generate_data():
    return {
        "Timestamp": datetime.utcnow().isoformat() + "Z", 
        "Driver": "Alice Adams",
        "Phone": "4072871649",
        "Drinking": False,
        "Eating": False,
        "OnPhone": False,
        "SeatbeltOff": False,
        "Sleeping": True,  # The only event that occurs
        "Smoking": False,
        "OutOfLane": False,
        "RiskyDrivers": 0,
        "UnsafeDistance": False,
        "HandsOffWheel": False,
        "FirstFlag": False,
        "LastFlag": False,
    }

async def connect():
    # use ws://localhost:8080 if local
    # wss://aifsd.xyz for deployed
    uri = "wss://aifsd.xyz"

    async with websockets.connect(uri) as websocket:
        print("Connected to the server")
        messageCount = 0
        
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
