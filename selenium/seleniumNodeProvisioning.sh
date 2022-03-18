#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Make seleniumNode user
useradd -m seleniumNode 
usermod --password SELENIUMNODELOGIN seleniumNode
cd /home/seleniumNode

# Install JRE and SMB and chromium
sudo apt install -y openjdk-8-jre-headless
sudo apt install -y smbclient
sudo snap install chromium

# Get the node files from fog
rm -rf selenium-server*
rm -rf nodeStart.sh
rm -rf seleniumDrivers/
rm -rf /lib/systemd/system/seleniumNode.service
smbget smb://iis-server.uom.memphis.edu/resources/selenium -U FOGSERVERLOGIN -R

# Move files to their new home
mv seleniumNode.service /lib/systemd/system/seleniumNode.service
chown seleniumNode:seleniumNode selenium-server*
chown -R seleniumNode:seleniumNode seleniumDrivers/

# Start/Enable Selenium as a service
sudo systemctl daemon-reload 
sudo systemctl enable seleniumNode.service 
sudo systemctl start seleniumNode.service 
sudo systemctl restart seleniumNode.service 

# This message will self-destruct in 5...
rm $SCRIPT_DIR/seleniumNodeProvisioning.sh

