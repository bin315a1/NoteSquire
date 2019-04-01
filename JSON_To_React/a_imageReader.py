import shutil
import json
from PIL import Image, ImageDraw
import argparse
import sys
import os

def createImageCopy(path):
    #image_cp = "C:/Users/Ashkan/LAHacks/NoteSquire/readerModule/temp/images/"+path[7:-4]+"_boxed.jpg"
    image_cp = "./src/boxed.jpg"
    shutil.copy(path, image_cp)
    return image_cp

def drawBoundaries(draw, bounds, color):

    for bound in bounds:
        draw.polygon([
            bound.vertices[0].x, bound.vertices[0].y,
            bound.vertices[1].x, bound.vertices[1].y,
            bound.vertices[2].x, bound.vertices[2].y,
            bound.vertices[3].x, bound.vertices[3].y], None, color)

def get_response(path):
    from google.cloud import vision
    import io
    client = vision.ImageAnnotatorClient()
    
    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.types.Image(content=content)

    response = client.document_text_detection(image=image)

    return response

#first run records the bounding vertices of the img objects and crops images
def first_run(path):
    response = get_response(path)
    json_data = {}

    img_bounds=[]
    
    for page in response.full_text_annotation.pages:
        img_vertices = []
        curr_index = None
        for block in page.blocks:
            #print(block.bounding_box)
            bloc_str = ""
            for paragraph in block.paragraphs:
                para_str = ""
                for word in paragraph.words:
                    word_text = ''.join([symbol.text for symbol in word.symbols])
                    try:
                        para_str += word_text
                    except:
                        print("skipped word")
                    #para_str += word_text
                bloc_str += para_str
            #print(bloc_str)
            if bloc_str.find("img"):
                if bloc_str.find("imgB") != -1:
                    img_obj={"index": bloc_str[-1],"left_top_v": {"x":block.bounding_box.vertices[0].x, "y": block.bounding_box.vertices[0].y}}
                    img_vertices.append(img_obj)
                if bloc_str.find("imgE") != -1:
                    for img in img_vertices:
                        if img["index"] == bloc_str[-1]:
                            img["right_bot_v"]={"x":block.bounding_box.vertices[2].x, "y": block.bounding_box.vertices[2].y}
        i=1
        for image in img_vertices:
            output_filename = "./src/images/img" + \
                str(i)+".jpg"
            try:
                x_t=image["left_top_v"]["x"]
                x_b=image["right_bot_v"]["x"]
                y_t=image["left_top_v"]["y"]
                y_b=image["right_bot_v"]["y"]
            except:
                pass
            box = (x_t, y_t, x_b, y_b)
            img_bounds.append(box)
            input_img = Image.open(path)
            input_img = input_img.transpose(Image.ROTATE_270)
#            input_img.show()
            output_img = input_img.crop(box)
            output_img.save(output_filename)
            i+=1
        json_data["images"]=img_vertices

    #print(json.dumps(json_data, indent=4, sort_keys=True))
    #with open('./temp/image_data.json', 'w') as outfile:
    cwd = os.getcwd()
    with open('./src/image_data.json', 'w') as outfile:
        json.dump(json_data, outfile)

    return img_bounds

def in_img(img_bounds, bounding_box):
    print(img_bounds)
    x_t=bounding_box.vertices[0].x
    y_t=bounding_box.vertices[0].y
    x_b=bounding_box.vertices[2].x
    y_b=bounding_box.vertices[2].y
    box = (x_t, y_t, x_b, y_b)
    #bounds: (3,3,6,6)
    print("tested block:", box)
    for bounds in img_bounds:
        print("all the img_bound s:" ,bounds)
        if (bounds[0]<box[0] and bounds[2]>box[0] and bounds[1]<box[1] and bounds[3]>box[1]) or (bounds[0] < box[2] and bounds[2] > box[2] and bounds[1]<box[3] and bounds[3]>box[3]):
            print("\n\n\n\n\n")
            return True
        else:
            pass
    return False

def detect_document(path, img_bounds):

    response=get_response(path)

    json_data = {}
    json_data["blocks"]=[]

    bounds_block=[]
    bounds_paragraph=[]
    
    for page in response.full_text_annotation.pages:
        page_height = page.height
        page_width = page.width
        json_data["size"]={"width":page_width, "height":page_height}
        for block in page.blocks:
            bloc = {}
            bloc["bloc_str"]=""
            bloc["left_top_v"]={"x":block.bounding_box.vertices[0].x/float(page_width), "y":block.bounding_box.vertices[0].y/float(page_height)}
            bloc["right_bot_v"]={"x":block.bounding_box.vertices[2].x/float(page_width), "y":block.bounding_box.vertices[2].y/float(page_height)}
            bloc["paragraphs"]=[]

            bounds_block.append(block.bounding_box)
            
            for paragraph in block.paragraphs:
                para = {}
                para["para_str"] = ""
                para["left_top_v"] = {"x":paragraph.bounding_box.vertices[0].x/float(page_width), "y":paragraph.bounding_box.vertices[0].y/float(page_height)}
                para["right_bot_v"] = {"x":paragraph.bounding_box.vertices[2].x/float(page_width), "y":paragraph.bounding_box.vertices[2].y/float(page_height)}
                for word in paragraph.words:
                    word_text = ''.join([symbol.text for symbol in word.symbols])
                    try:
                        para["para_str"] += (word_text+' ')
                    except:
                        print("skipped word")
                #print(para)
                bloc["bloc_str"] += para["para_str"]
                bloc["paragraphs"].append(para)

                bounds_paragraph.append(paragraph.bounding_box)
            if in_img(img_bounds, block.bounding_box):
                pass
            else:
                json_data["blocks"].append(bloc)
     #       json_data["blocks"].append(bloc)
    print(json.dumps(json_data, indent=4, sort_keys=True))
#    print(json_data)

    cwd = os.getcwd()
    with open('./src/text_data.json', 'w') as outfile:
        json.dump(json_data, outfile)

    return (bounds_block, bounds_paragraph)

def imageReader(path):
    img_bounds = first_run(path)
    bounds_block, bounds_paragraph = detect_document(path, img_bounds)
    path_cp = createImageCopy(path)

    image_opened = Image.open(path_cp)
    image_opened = image_opened.transpose(Image.ROTATE_270)
    draw = ImageDraw.Draw(image_opened)

    drawBoundaries(draw, bounds_block, 'red')
    drawBoundaries(draw, bounds_paragraph, 'green')
    
    image_opened.save(path_cp)


def main():
    if ((len(sys.argv) != 2)):
        print(len(sys.argv))
        print("Have just one argument man")
        sys.exit(0)
    
    parser = argparse.ArgumentParser()
    parser.add_argument("path", type=str)
    args = parser.parse_args()
    path = args.path
    imageReader(path)
    print(path)
    exit(0)
    #sys.stdout.flush()
    
main()
                                    
#    i = 0
#    for rect in bounds_para:
#        i+=1
#        print i,"th paragraph:\n"
#        print(rect)
#    drawBoundaries(path, bounds_para, 'red')
#    drawBoundaries(path, bounds_block, 'green')



#def getDiagramVertices(vertices):
#    min_x = vertices[0].x
#    min_y = vertices[0].y
#    for vertex in vertices:
#        if vertex.x < min_x:
#            min_x = vertex.x
#        if vertex.y < min_y:
#            min_y = vertex.y
#    return [min_x, min_y]
