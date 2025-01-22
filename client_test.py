# This file serves as an example of how to connect to the WebSockets endpoint
# as of 1/14/24, the data is just rendered at https://aifsd.xyz/wstest

import asyncio
import websockets
import random
import json
from datetime import datetime

timeoutSeconds = 1

eventsPerTrip = 10 # Simulating Trip based off events
eventCount = 0
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

async def connect():
    uri = "wss://aifsd.xyz"
    global eventCount, eventFrequencies

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
                "HandsOffWheel": random.choices([True, False], weights=[1, 30])[0],
            }

            # Print generated event (for debugging)
            # print(f"Generated Event: {data}")

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

            # Increment event count
            eventCount += 1

            # If the number of events reaches the threshold, calculate the safety score
            # * This is temporary and will be replaced by the end trip event
            if eventCount >= eventsPerTrip:
                pcf = calculate_pcf(eventFrequencies)
                safetyScore = calculate_safety_score(pcf)

                print(f"Trip Event Frequencies: {eventFrequencies}")
                print(f"Calculated PCF: {pcf}")
                print(f"Trip Safety Score: {safetyScore}")

                # Reset counters for the next trip
                eventCount = 0
                eventFrequencies = {}
            
            # Send data to server   
            json_data = json.dumps(data)
            await websocket.send(json_data)
            print("Sent message to server")

            # needed to serve as a ping mechanism
            await websocket.recv()
            await asyncio.sleep(timeoutSeconds)

# Run the connect function
asyncio.get_event_loop().run_until_complete(connect())
