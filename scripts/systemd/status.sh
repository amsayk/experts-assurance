#!/bin/sh

for x in main mail es; do sudo systemctl status fikrat-$x.service; done

for x in 7000 7001 7002 7003; do sudo systemctl status fikrat@$x.service; done

