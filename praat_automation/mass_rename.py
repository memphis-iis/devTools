## Python script to rename files in a directory that have spaces in their names
## and replace the spaces with underscores.
## Usage: python mass_rename.py

import os

# get all files in current directory
files = os.listdir('.')

# loop through each file
for file in files:
    # check if file has spaces in name
    if ' ' in file:
        # replace spaces with underscores
        new_file = file.replace(' ', '_')
        # replace apersands with underscores
        new_file = new_file.replace('&', '_')
        # replace commas with underscores
        new_file = new_file.replace(',', '_')
        # rename file
        os.rename(file, new_file)
        print('Renamed file: ' + file + ' to: ' + new_file)
