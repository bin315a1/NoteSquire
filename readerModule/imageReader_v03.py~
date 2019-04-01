import shutil
import json
from PIL import Image, ImageDraw
import argparse

def createImageCopy(path):
    image_cp = path[:-4]+"_boxed.jpg"
    shutil.copy(path, image_cp)
    return image_cp

def drawBoundaries(path, bounds, color):
    image_opened = Image.open(path)
    draw = ImageDraw.Draw(image_opened)

    for bound in bounds:
        draw.polygon([
            bound.vertices[0].x, bound.vertices[0].y,
            bound.vertices[1].x, bound.vertices[1].y,
            bound.vertices[2].x, bound.vertices[2].y,
            bound.vertices[3].x, bound.vertices[3].y], None, color)
    image_opened.save(path)

def getDiagramVertices(vertices):
    min_x = vertices[0].x
    min_y = vertices[0].y
    for vertex in vertices:
        if vertex.x < min_x:
            min_x = vertex.x
        if vertex.y < min_y:
            min_y = vertex.y
    return [min_x, min_y]

def detect_document(path):
    from google.cloud import vision
    import io
    client = vision.ImageAnnotatorClient()

    bounds_para = []
    bounds_block = []
    
    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.types.Image(content=content)

    response = client.document_text_detection(image=image)

#    from google.protobuf.json_format import MessageToJson
#    serialized = MessageToJson(response)
#    open("out.json","w").write(serialized)
    
    for page in response.full_text_annotation.pages:
        page_height = page.height
        page_width = page.width

        for block in page.blocks:
#            json.dumps(block.__dict__,write_file)
            print(dir(block)) 
            bounds_block.append(block.bounding_box)
            #print("Block Dimensions:", block.bounding_box)
            #print('\nBlock confidence: {}\n'.format(block.confidence))

            for paragraph in block.paragraphs:
                bounds_para.append(paragraph.bounding_box)
                x = paragraph.bounding_box.vertices.__getitem__(0)
                #print(x)
                para_str = ""
                print(paragraph.bounding_box)
                #print(dir(paragraph))
                #print('Paragraph confidence: {}'.format(paragraph.confidence))

                for word in paragraph.words:
                    word_text = ''.join([symbol.text for symbol in word.symbols])
                    try:
                        para_str += (word_text+' ')
#                        print('Word text: {} (confidence: {})'.format( word_text, word.confidence))
                    except:
                        print("skipped word")
                print(para_str)
#                    for symbol in word.symbols:
#                        try:
#                            print('\tSymbol: {} (confidence: {})'.format(symbol.text, symbol.confidence))
#                        except:
#                            print("skipped symbol")
#    i = 0
#    for rect in bounds_para:
#        i+=1
#        print i,"th paragraph:\n"
#        print(rect)
#    drawBoundaries(path, bounds_para, 'red')
#    drawBoundaries(path, bounds_block, 'green')
        
#def main():
#    parser = argparse.ArgumentParser()
#    parser.add_argument("path", type=str)
#    args = parser.parse_args()
#    path = args.path
    #path = '../../sample_images/IMG_3457.jpg'
#    path_cp = createImageCopy(path)
#    detect_document(path_cp)
#main()
