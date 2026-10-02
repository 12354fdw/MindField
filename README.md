# Mindfield

Mindfield is an experiment in Minecraft, using several independent "gurtyo" agents.

## Requirements

Create an .env file with the following arguments.
SERVER_ADDRESS=address of a minecraft server
AGENT_COUNT=how many agents? (not implemented)
PASSWD=server password if present

## Usage

Currently, there are only 3 commands.
To command an agent, whisper to them in the server.

### Example

/w gurtyo GOTO 0 0 0
This tells the agent to go to 0, 0, 0

### Command list

- GOTO (x, y, z) goes to a specific location.
- MINEAREA (ax, ay, az, bx, by, bz) Mines a rectangular area.
- STOPWALK () Stops the GOTO command.
  
## Warnings

The server has to be cracked.
