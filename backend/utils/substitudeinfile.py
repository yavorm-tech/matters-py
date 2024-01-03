import pdb
from shutil import copy2 as copyfile
from os import remove as removeFile


class substitueStringInFile:
    def __init__(self, infile: str = None, destination: str = None, removeInfile: bool = False):
        self.infile = infile
        self.destination = destination
        self.removeInfile = removeInfile

    def __str__(self):
        return f"{self}"
    # pattern is a list of dictionaries of form {pattern: pattern, substitution: substitution}

    def substitudeInFile(self, patterns: list):
        outfile = open(self.destination, "w+")
        with open(self.infile, "r") as infile:
            file_data = infile.read()
            for pattern in patterns:
                file_data = file_data.replace(
                    pattern['pattern'], pattern['substitution'])
            for line in file_data:
                outfile.write(line)
        outfile.close()
        if (self.removeInfile):
            removeFile(self.infile)

    def substitudeInPlace(self, patterns: list):
        print("substitude in file")
        outfile = open(f"{self.infile}-new", "w+")
        with open(self.infile,  "r") as infile:
            file_data = infile.read()
            for pattern in patterns:
                file_data = file_data.replace(
                    pattern['pattern'], f"{pattern['substitution']}")
            for line in file_data:
                outfile.write(line)
        outfile.close()
        copyfile(outfile.name, self.infile)
        removeFile(outfile.name)

# patterns =[{'pattern':'<nginx-port>','substitution':'12345'},{'pattern':'<container-ip>', 'substitution':'172.21.0.3'},{'pattern':'<port>', 'substitution':'80'}]
# patterns = (['one','one-two'],['two','two-three'])
# test = substitueStringInFile('/tmp/nginx-template.conf')
# test.substitudeInFile(patterns)
# test.closeFiles()
