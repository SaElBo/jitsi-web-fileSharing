ARG JITSI_REPO=jitsi
ARG BASE_TAG=stable-6173
FROM jitsi/web:stable-6173

USER root

RUN apt-get update && apt-get -y install --reinstall build-essential && apt-get -y install curl gnupg git  && curl -sL https://deb.nodesource.com/setup_12.x | bash -  && apt-get -y install nodejs

COPY . /usr/share/jitsi-meet
# ADD https://raw.githubusercontent.com/acmesh-official/acme.sh/2.8.8/acme.sh /opt
# COPY rootfs/ /

# RUN \
# 	apt-dpkg-wrap apt-get update && \
# 	apt-dpkg-wrap apt-get install -y cron nginx-extras jitsi-meet-web socat && \
# 	apt-dpkg-wrap apt-get -d install -y jitsi-meet-web-config && \
#     dpkg -x /var/cache/apt/archives/F-web-config*.deb /tmp/pkg && \
#     mv /tmp/pkg/usr/share/jitsi-meet-web-config/config.js /defaults && \
# 	mv /usr/share/jitsi-meet/interface_config.js /defaults && \
# 	rm -f /etc/nginx/conf.d/default.conf && \
# 	apt-cleanup && \
# 	rm -rf /tmp/pkg /var/cache/apt

RUN cd /usr/share/jitsi-meet/ && npm install && make

EXPOSE 80 443

VOLUME ["/config", "/usr/share/jitsi-meet/transcripts"]
VOLUME ["/jitsi-meet", "/usr/share/jitsi-meet/"]
