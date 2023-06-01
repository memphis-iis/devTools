// CSV combiner class
class CSVCombiner{

    //container for the combined csv
    string[] combinedCSV;

    //function with file path as parameter, returns a string array of the file's contents
    public string[] ReadCSV(string filePath){
        //read all lines of the file
        string[] lines = System.IO.File.ReadAllLines(filePath);
        //return the lines
        return lines;
    }
    //function with csv string array as parameter, adds the contents of the array to the combined csv
    public void AddToCombinedCSV(string[] csv){
        Console.WriteLine("Adding " + csv.Length + " lines to combined csv");
        //if the combined csv is empty
        if(combinedCSV == null){
            //set the combined csv to the csv parameter
            combinedCSV = csv;
        }
        //if the combined csv is not empty
        else{
           //only use the 2nd column to combine
              for(int i = 1; i < csv.Length; i++){
                //add the 2nd column of the csv parameter to the 2nd column of the combined csv
                combinedCSV[i] = combinedCSV[i] + "," + csv[i].Split(',')[1];
              }
        }
    }
    //function with file path as parameter and csv string as parameter, writes the csv string to the file. the csv string can be null, in which case the combined csv is written to the file
    public void WriteCSV(string filePath, string[] csv = null){
        //if the csv parameter is null
        if(csv == null){
            //set the csv parameter to the combined csv
            csv = combinedCSV;
        }
        //write the csv to the file
        System.IO.File.WriteAllLines(filePath, csv);
    }
}