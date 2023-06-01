using System;
using static CSVCombiner;

//write out welcome message
Console.WriteLine("Welcome to CSV Combiner!");

//read all files in the working directory, and store them in an array
string[] files = System.IO.Directory.GetFiles(System.IO.Directory.GetCurrentDirectory());

//create a new instance of CSVCombiner
CSVCombiner csvCombiner = new CSVCombiner();

//for each file in the files array, add the contents of the file to the combined csv
if(files.Length > 0){
    Console.WriteLine("Files found:" + files.Length);
    foreach(string file in files){
        //check if csv
        if(file.Substring(file.Length - 4) == ".csv"){
            //read the file
            string[] csv = csvCombiner.ReadCSV(file);
            //add a blank row at the 1st index
            csv[0] = csv[0] + "," + "";
            //add a row at 1nd index with the file name without the path
            csv[1] = "file," + file.Substring(file.LastIndexOf("\\") + 1);
            //add the csv to the combined csv
            csvCombiner.AddToCombinedCSV(csv);
        } else {
            Console.WriteLine("File " + file + " is not a csv");
        }
    }
} else{
    Console.WriteLine("No files found");
}

//write the combined csv to the file
try{
    csvCombiner.WriteCSV("combined.csv");
}
catch(Exception e){
    Console.WriteLine("Error writing to file: " + e.Message);
}
