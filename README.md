izac
================================================================================

> Open source repository for iZac, the NoiseBridge Barbot.

Dependencies
--------------------------------------------------

  * Node.js (>= v8.15.1)
  * Python3 (>= 3.7.3)
  * [dash][da]

[da]: https://en.wikipedia.org/wiki/Almquist_shell#dash:_Ubuntu,_Debian_and_POSIX_compliance_of_Linux_distributions


Setup
--------------------------------------------------

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

Raspberry Pi
--------------------------------------------------

See `notes/PI_SETUP.txt` for the setup instructions. If it's already
setup, then you can SSH into the box with:

```
TERM=xterm ssh pi@izac.noise
```

password should be `noisebridge`.
