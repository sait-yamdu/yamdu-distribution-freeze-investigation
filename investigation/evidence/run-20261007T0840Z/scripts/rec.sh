#!/bin/bash
# start screen recording of Xvfb :99 at 4 fps
ffmpeg -hide_banner -loglevel error -y -f x11grab -framerate 4 -video_size 1440x900 -i :99 -c:v libx264 -preset ultrafast -crf 32 -pix_fmt yuv420p "$1" </dev/null >/tmp/w/rec.log 2>&1 &
echo $! > /tmp/w/rec.pid
