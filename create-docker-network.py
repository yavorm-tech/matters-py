from python_on_whales import docker
import pdb, subprocess, sys
ip_addr = subprocess.getoutput("cat .env | grep NETWORK_CIDR | head -1 | cut -d '=' -f 2").replace('"','')
subnet = f"{ip_addr}.0/24"
name = subprocess.getoutput("cat .env | grep COMPOSE_PROJECT_NAME | head -1 | cut -d '=' -f 2").replace('"','')
docker.network.create(name=name, driver='bridge', subnet=subnet)
