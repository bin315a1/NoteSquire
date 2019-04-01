import React, { Component } from 'react';
import logo from './logo.svg';
import CloudUploadIcon from './cloudUpload.svg';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import { lightGreen, pink, amber } from '@material-ui/core/colors';
import CardMedia from '@material-ui/core/CardMedia';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';


function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

function Image(props) {
  console.log(props.images);
  var images = [];
  var aspectRatio = props.pageSize.height/props.pageSize.width;
  var docImgRatio = [];
  const imgs = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

  props.images.images.map(image => (
    images.push({ ///Users/jaminapps/Documents/Programming/react/testparse/src
      index:image.index,
      coordinates: {
        left_top: {
          y:image.left_top_v.y/props.pageSize.height,
          x:image.left_top_v.x/props.pageSize.width
        },
        right_bot: {
          y:image.right_bot_v.y/props.pageSize.height,
          x:image.right_bot_v.x/props.pageSize.width
        }
      },
      imageRatio: (image.right_bot_v.x - image.left_top_v.x)/props.pageSize.width
    })
  ));

  return (
    images.map(image => (
      console.log(image),
      <CardMedia component="img" image={imgs[`img${image.index}.jpg`]} title="image not loaded" style={{
        position:'absolute',
        left:image.coordinates.left_top.x*100+'%',
        top:image.coordinates.left_top.y*100+'%',
        width: image.imageRatio*100+'%'
      }} />
    ))
  );
}

function Page(props) {
  var page = {
    blocks: [],
    dimensions: {
      width:props.data.size.width,
      height:props.data.size.height,
      aspectRatio: (props.data.size.height/props.data.size.width)
    }
  };

  for (var i = 0; i < props.data.blocks.length; i++) {
    page.blocks.push({
        paragraphs:[],
        coordinates: {
          left_top: {
            x: props.data.blocks[i].left_top_v.x,
            y: props.data.blocks[i].left_top_v.y
          },
          right_bot: {
            x: props.data.blocks[i].right_bot_v.x,
            y: props.data.blocks[i].right_bot_v.y
          }
        }
    });

    for (var j = 0; j < props.data.blocks[i].paragraphs.length; j++) {
      page.blocks[i].paragraphs.push({
        element:props.data.blocks[i].paragraphs[j].para_str,
        coordinates: {
          left_top: {
            x: props.data.blocks[i].paragraphs[j].left_top_v.x,
            y: props.data.blocks[i].paragraphs[j].left_top_v.y
          },
          right_bot: {
            x: props.data.blocks[i].paragraphs[j].right_bot_v.x,
            y: props.data.blocks[i].paragraphs[j].right_bot_v.y
          }
        }
      });
    }
  }

  return (
      <Paper style={{
        position: 'absolute',
        paddingBottom: (page.dimensions.aspectRatio)*90 + 'vw',
        width: '70vw',
        left:'15vw',
        right:'15vw',
        fontSize:'10vw',
        backgroundColor: amber[50],
        zIndex:1
      }}>
      {[
        <Image images={props.images} pageSize={{
          width:props.data.size.width,
          height:props.data.size.height
        }}/>,
        page.blocks.map(block => (
          console.log((block.coordinates.right_bot.x - block.coordinates.left_top.x) * 100),
          block.paragraphs.map(paragraph => (
                  <Typography variant="body1" style={{
                    position:'absolute',
                    fontSize: '17%',
                    left:(paragraph.coordinates.left_top.x * 100)+'%',
                    top:(paragraph.coordinates.left_top.y * 100)+'%',
                    height:(paragraph.coordinates.right_bot.y - paragraph.coordinates.left_top.y) * 100 + '%',
                    fontFamily: 'Oswald, sans-serif',
                    paddingRight:'30px'
                  }}>
                  {paragraph.element}
                  </Typography>
          ))

      ))

    ]}
    </Paper>

  );
}

class App extends Component {

  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({
      secondLoaded: true,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      textItems:{},
      imageData:{},
      isLoaded:false,
      secondLoaded:false
    }
  }

  componentDidMount() {

    try {
      var textData = require('D:/noteSquire/NoteSquire_repo_demo/NoteSquire/JSON_To_React/src/text_data.json');
      var imageData = require('D:/noteSquire/NoteSquire_repo_demo/NoteSquire/JSON_To_React/src/image_data.json');
      this.setState({
        textItem: textData,
        imageData: imageData,
        isLoaded:true,
      });
    }
    catch(err) {
      console.log('error');
    }

  }

  render() {


    var { isLoaded, textItem, imageData } = this.state;
    if (!isLoaded) {
      return (
        <CircularProgress color={'secondary'} size={'150px'} style={{
            position:'absolute',
            left:'45%',
            top:'45%'
        }}/>
      );
    }
    else {
        return (

          <body style={{
            paddingTop: '5%',
            paddingBottom: "115%",
            minWidth: '240px',
            minHeight: '120px',
            width: '100vw'
          }}>
            <Page data={textItem} images={imageData} />
          </body>
        );
        // else
        // {
        //   return (
        //     <body style={{
        //       paddingTop: '5%',
        //       paddingBottom: "115%",
        //       minWidth: '240px',
        //       minHeight: '120px',
        //       width: '100vw'
        //     }}>
        //     <label htmlFor="contained-button-file">
        //       <Button variant="contained" color="default" onClick={this.handleClick}>
        //         Upload
        //         <CloudUploadIcon/>
        //       </Button>
        //     </label>
        //     </body>
        //   );
        // }
    }


  }

}
export default App;
