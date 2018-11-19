#! bash
netsh wlan set hostednetwork mode=allow ssid=Songmachine key=Songmachine
netsh wlan start hostednetwork
net start SharedAccess
#https://yarnpkg.com/en/package/node-hotspot  ???
#https://superuser.com/questions/470319/how-to-enable-internet-connection-sharing-using-command-line  ???