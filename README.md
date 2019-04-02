# NoteSquire
A UCLA Hackathon(2019) project by Han Bin Lee, Benjamin Choi, Ashkan Faghihi, and Giovanni Moya

NoteSquire is a project that aims to make taking class notes to a new level. To store a handwritten page of a note, all you need to do is take a picture of the page and upload it. Characters will be detected and converted into digital text, and diagrams will be cropped and added into the digital note!

Roles:
Han - create python module that takes an image and outputs the detected data in the image, using GCP Vision API

Ben - create a React app that takes in Han's python module's output and create an HTML file (end product)

Gio - frontend implementations and web design

Ash - backend implementations

# Motivation
It started from a small conversation between us in a management course, here in UCLA. To take notes in the class, we started to use google docs/ oneNote to take notes digitally. But at one point in the course, our professor began to draw a lot of diagrams and graphs, which we couldn't draw and save into our digital notes. It became annoying as we had to start taking old fashioned notes with pen and paper (to draw the diagrams and such) and we wouldn't be able to save our notes digitally. Then we thought that hey, it would be nice if we can simply take a picture of a page of handwritten notes and a program can text-ize the characters, and crop out the diagrams automatically using machine learning - which is exactly what this project is about

# Workflow, APIs and Libraries used
For the basic web framework we used node.js with react, which we used to create a simple 2-page web page where you can upload an image and view the resulting digitalized notes.
For the implementation of the digitalization, we used Google Cloud Vision API 's OCR with python scripts to extract text and their positional values from the image. Then the python scripts outputs two JSON files (one containing string & positional values of the detected text in image, and the other containing positional values of the cropped diagram images in the image) and varying amount of cropped diagram image files. A react app then loads the JSON and image files, which then creates the resulting HTML file.

# Sample Outputs
sample input image:

<img src="https://user-images.githubusercontent.com/42255588/55291814-30c71a80-5398-11e9-9e05-31b7a06be759.JPG" width="60%" height="60%">

cropped diagram images:

<img src="https://user-images.githubusercontent.com/42255588/55291844-7c79c400-5398-11e9-8111-12cfdd7421b8.jpg" width="50%" height="50%">
<img src="https://user-images.githubusercontent.com/42255588/55291845-7c79c400-5398-11e9-8c85-508d6bd888f8.jpg" width="50%" height="50%">

GCP detected text regions: (look closely and there are lines)

<img src="https://user-images.githubusercontent.com/42255588/55291998-345ba100-539a-11e9-93f4-726efb280fe1.jpg" width="80%" height="80%">

Outputted page of digital note:

<img src="https://user-images.githubusercontent.com/42255588/55292099-5ace0c00-539b-11e9-9e2a-f683b8f7dfe0.png" width="80%" height="80%">

# Try it out
- Note: implementation for the website/ upload is not finished yet, and you a working GCP API Key for the python module to work.

1) Take a picture of the page of notes; make sure the handwriting is clear and spaced out properly,
 and indicate the left-top and bottom-right borders with the specific syntax: <imgB>[index] <imgE>[index]
  
2) Place the image file in the directory NoteSquire/JSON_To_React

3) In NoteSquire/JSON_To_React, run npm start

4) With a new terminal in NoteSquire/JSON_To_React, run the command py a_imageReader.py [image file name]

5) The resulting HTML output will be opened in your browser
