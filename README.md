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

### Testing on the RPI3 from your local computer

This section is for those that want to develop on their local machine
and send code over the network to their raspberry pi for a tighter
feedbak loop with real hardware.

#### Initial Steps.

Generate a key on your local machine if needed with `$
ssh-keygen`. This is your public/private keypair.

Copy your public key (default: `~/.ssh/id_rsa.pub`) to the raspberry
Pi's `~/.ssh/authorized_keys` file. One way to do this is with netcat
(`$ nc`):

On the Raspberry Pi:

  1. Connect to the same network that you're local computer is on.
  2. Get (and record for later) your Pi's IPv4 address with: `$ ifconfig`
    - e.g. `10.0.1.1`
  3. Run the following to start listening port 1337: `$ nc -l 1337`
  4. Ensure that the `ssh` service is enabled & running:
    - `$ sudo systemctl enable ssh`
    - `$ sudo systemctl restart ssh`

rsync -a --exclude='.git/' izac/ pi@10.20.3.21:~

On your local computer:

  1. Connect to the Pi's nc session `$ nc <Pi's IP address> 1337`
  2. Copy/Paste your **public key** into this session and hit enter.
    - This transfers your public key, unencrypted, over the network to the
      Pi from your local computer. It's important that this is your public
      key and not your private key!
  3. Once the public key appears in the Pi's `nc` output, copy the public
     key and add it as a line in the Pi's `~/.ssh/authorized_keys` file.
       - You must create directory and file if it does not exist.

#### Creating the ssh connection:

From your local computer, ssh into the Pi:


```
ssh pi@<Pi's IP address>
```

If it prompts you for a password, ask someone in the space for it.

Once you're sucessfully SSHed into the Pi from your local computer,
congrats! We can start syncing code with the Pi.

#### Syncing code from your local computer to the Pi.

Once SSH works, use `$ rsync` on your local machine to sync local dev
code with the Pi.

e.g. this transfers a directory, `izac/`, to a remote Pi's IP address:

```
rsync -a --progress --exclude='.git/' --exclude='node_modules' izac/ pi@<Pi's IP address>:~/izac
```

#### Running the synced codebase on your Raspberry Pi

On your Raspberry Pi, run the following commands:

```
sudo apt-get install nodejs npm
cd /path/to/git/repo/izac/
```

And proceed to follow the Production Build steps, or just use the
development flow.

Production Builds
--------------------------------------------------

```
npm run build
npm run prod
```
