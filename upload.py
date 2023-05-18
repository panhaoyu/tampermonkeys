import os
from pathlib import Path

base_dir = Path(__file__).parent
for root, _, sub_files in os.walk(base_dir):
    root = Path(root)
    for sub_file in sub_files:
        sub_file = root / sub_file
        if not sub_file.suffix == '.js':
            continue
        remote_path = sub_file.relative_to(base_dir)
        command = f'scp -r -S C:/Windows/System32/OpenSSH/ssh.exe "{sub_file}" ' \
                  f'root@panhaoyu.com:/var/lib/docker/volumes/docker_static/_data/tampermonkey/{remote_path}'
        os.system(command)
