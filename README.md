izac
================================================================================

> Open source repository for iZac, the NoiseBridge Barbot.

Requirements
--------------------------------------------------

### Runtime

  * Node.js (>= v8.15.1)
  * Python3 (>= 3.7.3)
  * [dash][da]

[da]: https://en.wikipedia.org/wiki/Almquist_shell#dash:_Ubuntu,_Debian_and_POSIX_compliance_of_Linux_distributions


Dev Setup
--------------------------------------------------

### Tooling

On your local machine:

```
npm install
npx lerna bootstrap
npm start
```

### Raspberry Pi

See `notes/PI_SETUP.txt` for the setup instructions. If it's already
setup, then you can SSH into the box with:

```
TERM=xterm ssh pi@izac.noise
```

password should be `noisebridge`.


Production Builds
--------------------------------------------------

```
npm run build
npm run prod
```
