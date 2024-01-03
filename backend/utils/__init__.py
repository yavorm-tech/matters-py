def returnValueFromIndex(index):
    try:
        return_val = index
    except IndexError:
        return_val = None
    return return_val
