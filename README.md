dead.tokyo
==========

## Installation
The whole project can be copied into desired directory with ```git clone```.

I've set up a Systemd unit (upload.service) that will automatically start the service for you.

## Password Management
Hashed passwords are stored in password.json file (path can be set in config.json).

Two scripts are provided for easier management:
```
npm run addPassword ThisIsMyPassword 

npm run removePassword ThisIsMyPassword
```

## Config
Location of password file, allowed upload file extensions and location where files will be saved
can be set in config.json.

In case of missing entries default values will be provided. If you mess up your config you can just remove it completely
to reset it with default values.

Currently, there is no check for malformed entries.


## Logs
Logs can be found in the ```combined.log``` or ```error.log``` files.

Combined.log contains all the logs produced by the program, including debug info about normal operations.
Error.log contains only logs produced by erronous operations (File upload failures, password attempts failures, login attempt timeouts etc.)
