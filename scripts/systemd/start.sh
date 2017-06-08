#!/bin/sh

echo starting main, es and mail
for x in main mail es; do sudo systemctl start fikrat-$x.service; done

echo starting 7000
for x in 7000; do sudo systemctl start fikrat@$x.service; done

sleep 15

echo starting 7001, 7002 and 7003
for x in 7001 7002 7003; do sudo systemctl start fikrat@$x.service; done

sudo systemctl restart nginx.service

