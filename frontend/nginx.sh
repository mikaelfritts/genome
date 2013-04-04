#!/bin/bash
if [ -f ${PWD}/nginx.pid ]
then
	kill `cat ${PWD}/nginx.pid`
fi
nginx -c ${PWD}/nginx.conf -g "pid ${PWD}/nginx.pid;"
echo "Nginx Server Started"
