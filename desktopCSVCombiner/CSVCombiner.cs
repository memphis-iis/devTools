using System;

//csv combiner
namespace CSVCombiner{

    public class CSVCombine{
        public string[,] csvCombined = new string[0, 0];
        //function to read csv file, parse it as 2d array, and return it
        public string[,] readCSV(string path){
            //read csv file
            string[] lines = System.IO.File.ReadAllLines(path);
            //get number of rows and columns
            int rows = lines.Length;
            int cols = lines[0].Split(',').Length;
            //create 2d array
            string[,] csv = new string[rows, cols];
            //parse csv file into 2d array
            for(int i = 0; i < rows; i++){
                string[] line = lines[i].Split(',');
                for(int j = 0; j < cols; j++){
                    csv[i, j] = line[j];
                }
            }
            //rotate 2d array to where columns are rows and rows are columns
            string[,] csvRotated = new string[cols, rows];
            for(int i = 0; i < cols; i++){
                for(int j = 0; j < rows; j++){
                    csvRotated[i, j] = csv[j, i];
                }
            }
            //return rotated 2d array
            return csvRotated;
        }
        //function to write 2d array to csv file
        public void writeCSV(){
            string [,] csv = csvCombined;
            //get number of rows and columns
            int rows = csv.GetLength(0);
            int cols = csv.GetLength(1);
            //create string to write to file
            string csvString = "";
            //parse 2d array into string
            for(int i = 0; i < rows; i++){
                for(int j = 0; j < cols; j++){
                    csvString += csv[i, j];
                    if(j < cols - 1){
                        csvString += ",";
                    }
                }
                csvString += "\n";
            }
            //write string to file
            string path = "./output/combined.csv";
            Console.WriteLine("Writing CSV file: " + path);
            System.IO.File.WriteAllText(path, csvString);
            Console.WriteLine("CSV file written to: " + path);
        }
        public void appendToCSV(string[,] csv, string filePath){
            //get number of rows and columns
            int rows = csv.GetLength(0);
            int cols = csv.GetLength(1);
            //get number of rows and columns in combined csv
            int rowsCombined = csvCombined.GetLength(0);
            int colsCombined = csvCombined.GetLength(1);
            //if combined csv is not empty, remove header row
            if(rowsCombined > 0){
                //drop header row from csv
                string[,] csvNoHeader = new string[rows - 1, cols];
                for(int i = 1; i < rows; i++){
                    for(int j = 0; j < cols; j++){
                        csvNoHeader[i - 1, j] = csv[i, j];
                    }
                }
                //set csv to csvNoHeader
                csv = csvNoHeader;
                //decrement rows
                rows--;
            }
            //add a new column to csv at index 0, and set all values to filePath
            string[,] csvFilePath = new string[rows, cols + 1];
            for(int i = 0; i < rows; i++){
                csvFilePath[i, 0] = filePath;
                for(int j = 0; j < cols; j++){
                    csvFilePath[i, j + 1] = csv[i, j];
                }
            }
            //set csv to csvFilePath
            csv = csvFilePath;
            //get new number of rows and columns in csv
            rows = csv.GetLength(0);
            //create new 2d array to store combined csv
            string[,] csvNew = new string[rows + rowsCombined, cols];
            //copy combined csv into new 2d array
            for(int i = 0; i < rowsCombined; i++){
                for(int j = 0; j < colsCombined; j++){
                    csvNew[i, j] = csvCombined[i, j];
                }
            }
            //copy csv into new 2d array
            for(int i = 0; i < rows; i++){
                for(int j = 0; j < cols; j++){
                    csvNew[i + rowsCombined, j] = csv[i, j];
                }
            }
            //set combined csv to new 2d array
            csvCombined = csvNew;

            //set [0,0] to filepath
            csvCombined[0, 0] = "File Path";

            //write combined csv to file
            writeCSV();
        }
    }
}

