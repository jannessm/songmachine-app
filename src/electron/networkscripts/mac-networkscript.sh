#! /bin/bash
sudo networksetup -createnetworkservice Songmachine lo0 && networksetup -setmanual Songmachine 172.20.42.42 255.255.0.0 # 172.20.42.42 -> IP of webserve
# still needs manual sharing!!!