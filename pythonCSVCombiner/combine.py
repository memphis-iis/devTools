## Python script to combine multiple CSV files into one CSV file.
## The script will combine all CSV files in the ./input/ directory into one CSV file in the ./output/ directory.
## The script will also add a column to the combined CSV file that contains the name of the original CSV file.
## the final csv will be rotated 90 degrees to make it easier to read.

import os
import csv
import pandas as pd

# Create a list of all CSV files in the ./input/ directory
csvList = []
for file in os.listdir('./input/'):
    if file.endswith('.csv'):
        csvList.append(file)

# create a dataframe for the final csv
df = pd.DataFrame()
# loop through each csv file in the ./input/ directory
for csvFile in csvList:
    #open the csv file, read it, rotate it 90 degrees, and add a column with the name of the csv file
    with open('./input/' + csvFile, 'r') as f:
        reader = csv.reader(f)
        data = list(reader)
        df2 = pd.DataFrame(data)
        df2 = df2.transpose()
        #add a column with the name of the csv file
        df2['csvFile'] = csvFile
        #store the header row
        header = df2.iloc[0]
        #remove the header row
        df2 = df2.iloc[1:]
        # add the rotated csv to the final csv dataframe
        df = df.append(df2, ignore_index=True)
    
# add the header row as the first row of the final csv
df.columns = header
df = df.reindex(columns=header)

# write the final csv to the ./output/ directory
df.to_csv('./output/combined.csv', index=False, header=True)