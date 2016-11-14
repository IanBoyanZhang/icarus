#!/usr/bin/python

import os

fileList = {}

f = open('fileList', 'w')

counter = 0
abs_path = '/Users/i658481/Workspace/digital-ui-area/src/dashboard/profile'
# traverse root directory, and list directories as dirs and files as files
for root, dirs, files in os.walk(abs_path, topdown=False):
    for name in files:
        if name.endswith('.js'):
            filename = os.path.join(root, name)
            print(filename)
            f.write(''.join([filename, '\n']))
            counter+=1
#    for name in dirs:
#        print(os.path.join(root, name))

f.close()
print counter
