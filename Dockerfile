# 
#  ███████╗███████╗████████╗██╗   ██╗██████╗ 
#  ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
#  ███████╗█████╗     ██║   ██║   ██║██████╔╝
#  ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ 
#  ███████║███████╗   ██║   ╚██████╔╝██║     
#  ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     
#                                            
# 

ARG NPM_SCRIPT="build"
ARG NODE_ENV="production"


# 
#  ██████╗ ██╗   ██╗██╗██╗     ██████╗ 
#  ██╔══██╗██║   ██║██║██║     ██╔══██╗
#  ██████╔╝██║   ██║██║██║     ██║  ██║
#  ██╔══██╗██║   ██║██║██║     ██║  ██║
#  ██████╔╝╚██████╔╝██║███████╗██████╔╝
#  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ 
#                                      
# 

# build components preview
FROM node:lts AS build
ARG NPM_SCRIPT
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY ./package.json \
  ./package-lock.json ./

RUN npm ci

COPY ./tsconfig.json \
  ./svelte.config.js \
  ./vite.config.ts ./

# COPY ./.svelte-kit ./.svelte-kit
COPY ./static/ ./static
COPY ./src/ ./src

RUN npm run ${NPM_SCRIPT}

# 
#  ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
#  ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
#  ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
#  ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
#  ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
#  ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
#                                                   
# 

FROM caddy:2

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /srv