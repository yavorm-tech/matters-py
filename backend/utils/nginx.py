# I have port number and container ip address from deployment
# variables for nginx file - nginx-port, container-ip, container-port, server-name


def substituteNginxConfParams(fname, foutname, container_ip, containers_def_port, nginx_port, server_name, container_name):
    fin = open(fname, "rt")
    fout = open(foutname, "w+")
    for line in fin:
        #        pdb.set_trace()
        if ("<container-ip>:<port>") in line:
            fout.write(line.replace('<container-ip>:<port>',
                                    f"{container_ip}:{containers_def_port}"))
        elif ("<nginx-port>" in line):
            fout.write(line.replace('<nginx-port>', f"{nginx_port}"))
        elif ("<server-name" in line):
            fout.write(line.replace('<server-name>',
                       f"{server_name}.payarc.dev"))
        elif ("<container-name>" in line):
            fout.write(line.replace('<container-name>', f"{container_name}"))
        else:
            fout.write(line)
    fin.close()
    fout.close()
