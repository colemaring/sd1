import asyncio
import websockets
import random
import json
from datetime import datetime

numMessages = 10 # Number of messages to send (exists to simulate first/last flags)
timeoutSec = 1 # Time to wait between generating new data

eventFrequencies = {}

# Constants
BASE_PCF = 0.50243837
SAFETY_SCORE_BASE = 113.96245249
SAFETY_SCORE_SCALING = 27.78938322
MULTIPLIERS = {
    "Drinking": 1.18282601,
    "Eating": 1.01,
    "Phone": 1.04,
    "SeatbeltOff": 1.01500342,
    "Sleeping": 1.5,
    "Smoking": 1.02,
    "OutOfLane": 1.2,
    "UnsafeDistance": 1.00431643,
    "HandsOnWheel_1": 1.10,
    "HandsOnWheel_0": 1.30,
}

def calculate_risky_drivers_multiplier(risky_drivers):
    """
    Calculate the multiplier for RiskyDrivers based on their count.
    
    Parameters:
    - risky_drivers (int): Number of risky drivers detected.

    Returns:
    - float: RiskyDrivers multiplier.
    """
    # Linear scaling: Each risky driver adds 0.1 to the multiplier
    return 1 + 0.1 * risky_drivers

def calculate_pcf(eventFrequencies):
    """
    Calculate the Predicted Collision Frequency (PCF) based on event frequencies.
    
    Parameters:
    - eventFrequencies (dict): Dictionary of event frequencies.

    Returns:
    - float: Predicted Collision Frequency (PCF).
    """
    pcf = BASE_PCF
    for event, frequency in eventFrequencies.items():
        if event == "RiskyDrivers":
            # Handling RiskyDrivers multiplier
            pcf *= calculate_risky_drivers_multiplier(frequency)
        elif event in MULTIPLIERS:
            multiplier = MULTIPLIERS[event]
            adjustedMultiplier = 1 + (multiplier - 1) * frequency
            pcf *= adjustedMultiplier
    return pcf

def calculate_safety_score(pcf):
    """
    Calculate the Safety Score based on PCF.
    
    Parameters:
    - pcf (float): Predicted Collision Frequency.

    Returns:
    - float: Safety Score (0-100, higher is safer).
    """
    score = SAFETY_SCORE_BASE - (SAFETY_SCORE_SCALING * pcf)
    return max(0, min(score, 100))  # Clamp the score between 0 and 100

async def generate_data():
    return {
        "Timestamp": datetime.utcnow().isoformat() + "Z", 
        "Driver": "Test Dude2",
        "Phone": "2211524256",
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

            # Exclude Timestamp from comparison
            dataExcludeTimestamp = {k: v for k, v in data.items() if k != "Timestamp"}

            # Only send data if it has changed
            if (prevData != dataExcludeTimestamp): 
                messageCount += 1
                prevData = dataExcludeTimestamp
                data["FirstFlag"] = messageCount == 1
                data["LastFlag"] = messageCount == numMessages

                # On trip end send the calculated risk score
                if data["LastFlag"]:
                    pcf = calculate_pcf(eventFrequencies)
                    safetyScore = calculate_safety_score(pcf)

                    print(f"Trip Event Frequencies: {eventFrequencies}")
                    print(f"Calculated PCF: {pcf}")
                    print(f"Trip Safety Score: {safetyScore}")
                    data["risk_score"] = round(safetyScore, 2)

                    # Reset for the next trip
                    eventFrequencies = {}

                # Send data to server   
                await websocket.send(json.dumps(data))
                print("Sent message to server")
                await websocket.recv() # Tells ws server we still exist
                
            # Update event frequencies
            for key, value in data.items():
                if key == "HandsOnWheel":
                    if value == 1:
                        eventFrequencies["HandsOnWheel_1"] = eventFrequencies.get("HandsOnWheel_1", 0) + 1
                    elif value == 0:
                        eventFrequencies["HandsOnWheel_0"] = eventFrequencies.get("HandsOnWheel_0", 0) + 1
                elif key == "RiskyDrivers" and value > 0:
                    eventFrequencies["RiskyDrivers"] = eventFrequencies.get("RiskyDrivers", 0) + value
                elif isinstance(value, bool) and value:
                    eventFrequencies[key] = eventFrequencies.get(key, 0) + 1

            await asyncio.sleep(timeoutSec)
        
        print ("Sent " + str(messageCount) + " messages, ending program.")

# Run the connect function
print("Running emulator script for " + str(numMessages) + " messages.")
asyncio.get_event_loop().run_until_complete(connect())
