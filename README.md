================================================================================

# new as of 12/11/2021

Can't figure out what we were doing here. Some Lerna packing stuff.
The webserver was packaged, and imported into the react frontend (see [izac\packages\react-ui\src\pages\Order.jsx](izac\packages\react-ui\src\pages\Order.jsx)) for example.
Didn't feel like fixing it, so I made some mock functions so you can get the webserver running.

Honestly, it's probably best to build it all from scratch.
We built this in a hurry. And there was some heavy drinking involved.
But please keep the drink css animation [izac\packages\react-ui\src\components\Animation.jsx](izac\packages\react-ui\src\components\Animation.jsx)
It was a thing of beauty.

Running the webserver

```
cd packages
cd react-ui
npm i
npm start
```

All of the front-end functions are mocked in [packages\react-ui\src\pages\FAKE_API.js](packages\react-ui\src\pages\FAKE_API.js)

Just take these functions and add them to a new api if you want.

glhf,

-tyler

================================================================================

> Open source repository for iZac, the NoiseBridge Barbot.

> Additional info at: https://tylermaran.github.io/izac/

## Dependencies

-   Node.js (>= v8.15.1)
-   Python3 (>= 3.7.3)
-   [dash][da]

[da]: https://en.wikipedia.org/wiki/Almquist_shell#dash:_Ubuntu,_Debian_and_POSIX_compliance_of_Linux_distributions

## Setup

### 0. Configure `config.sh`

In this top-level directory, there is a default "config.sh" script
that you can modify as you wish.

### 1. Bootstrap

```
npm install
npm run bootstrap
```

### 2. Start

#### Development

```
source config.sh
npm start
```

#### Production

```
source config.sh
npm run build
npm run prod
```

## Raspberry Pi

See `notes/PI_SETUP.txt` for the setup instructions. If it's already
setup, then you can SSH into the box with:

```
TERM=xterm ssh pi@izac.noise
```

password should be `noisebridge`.
