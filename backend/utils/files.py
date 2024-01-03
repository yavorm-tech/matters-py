import os


def removeFile(fname):
    try:
        os.remove(fname)
        return 0
    except FileNotFoundError as e:
        return e
