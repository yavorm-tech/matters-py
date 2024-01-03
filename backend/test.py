import paramiko, pdb


ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('172.20.0.1', port=22, username='restartnginx',
            password='1234qwer', timeout=3)
stdin, stdout, stderr = ssh.exec_command('sudo /etc/init.d/nginx restart')
out = stdout.read().decode()
err = stderr.read().decode()
pdb.set_trace()
ssh.close()

