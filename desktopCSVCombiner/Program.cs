using System;
using CSVCombiner;

//desktop csv combiner
Console.WriteLine("Desktop CSV Combiner");

//set input path to ./input
string inputPath = "./input";

//set output path to ./output
string outputPath = "./output";

//create 2d array to store csv data
string[,] csv = new string[0, 0];

//create csv combiner object
CSVCombine csvCombiner = new CSVCombine();

string[,] header = null;

string[,] combinedCSV = null;


//get input files
string[] inputPaths = System.IO.Directory.GetFiles(inputPath);

//loop through input files
for(int i = 0; i < inputPaths.Length; i++){
    //get path
    string path = inputPaths[i];
    Console.WriteLine("Processing CSV file number " + i + "of" + inputPaths.Length);
    //read csv file
    Console.WriteLine("Reading CSV file: " + path);
    csv = csvCombiner.readCSV(path);
    //combine csv
    Console.WriteLine("Combining CSV file: " + path);
    //get the filename from the path
    string fileName = path.Split('/')[2];
    csvCombiner.appendToCSV(csv, fileName);
}
