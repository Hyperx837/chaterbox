kitty @ launch --title yarn
kitty @ launch --title uvicorn
kitty @ launch --title cli

sleep 1

kitty @ send-text --match title:yarn cd `pwd` \
yarn start
kitty @ send-text --match title:uvicorn cd `pwd`
kitty @ send-text --match title:cli cd `pwd`

kitty @ send-text --match title:uvicorn uvicorn main:app --reload
kitty @ send-text --match title:yarn yarn start 
