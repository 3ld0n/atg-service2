FROM 	centos:centos6

# Enable EPEL for Node.js
RUN 	rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install node.js and npm
RUN yum install -y npm

#Bundle app source
#COPY . /src

# Install app dependencies
RUN  npm install

EXPOSE 8888
CMD ["node", "service2.js"]