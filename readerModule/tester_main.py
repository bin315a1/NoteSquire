import a_imageReader as ir

def main():
#    parser = argparse.ArgumentParser()
#    parser.add_argument("path", type=str)
#    args = parser.parse_args()
#    path = args.path
    path = './temp/withTagIndex_6.JPG'
#    path_cp = ir.createImageCopy(path)
#    ir.detect_document(path_cp)
#    ir.first_run(path_cp)
    ir.imageReader(path)
main()
    
