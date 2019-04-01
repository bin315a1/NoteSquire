import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';




const headerTabsStyle = {
  width: '100%',
  height: '56px',
  borderradius: '4px',
  position: 'relative',
  backgroundcolor: 'rgba(255,255,255,0.3)',
  transition: '0.3s' 
}

const cardStyle = {
width: '18rem',
display: 'inline-block',
margin: '50px'
}

const cardText = {
position: 'absolute',
bottom: '10px',
width: '50%'
}

class Header extends Component {

render() {
  return (
<nav class="navbar navbar-expand-lg navbar-light bg-light">
<a class="navbar-brand text-black " href="http://localhost:3000/">NoteSquire</a>
<div class="btn-group" role="group" aria-label="Basic example">
<button type="button" class="btn btn-secondary " href="http://localhost:3000/f">Dashboard</button>
</div>
</nav>
  );
}
}

class Page extends Component {

render() {

  return(
    <div class="container">
    <div class="row">
    <div class="card col" style={cardStyle}>
      <img src="https://www.wsfcs.k12.nc.us/cms/lib/NC01001395/Centricity/Domain/5276/Division%20of%20Fractions%202%20001.jpg" class="card-img-top" alt="..."/>
      <div class="card-body">
        <p class="card-text cardText">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
    </div>
      <div class="card col" style={cardStyle}>
      <img src="https://static01.nyt.com/images/2017/08/06/education/06ESSAY/06ESSAY-articleLarge.jpg?quality=75&auto=webp&disable=upscale" class="card-img-top" alt="..."/>
      <div class="card-body">
        <p class="card-text cardText">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
  </div>
      <div class="card col" style={cardStyle}>
        <img src="https://positivelymad.com/img/pagehero/exam-busters-header.jpg" class="card-img-top" alt="..."/>
      <div class="card-body">
        <p class="card-text cardText">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
    </div>
    </div>
</div>
  );
}

}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      file: null
    }
  }
  uploadFile = event => {
    event.preventDefault();
    console.log(event);
    console.log(event.target.files[0]);
  }
//image-location
  render() {
    return (
      <div className="App">
      <Header/>
      <Page/>
          <form method='post' action='http://localhost:5000/' enctype="multipart/form-data">
	            <input text="Upload" type="file" onChange={this.uploadFile} name="imageLocation"/>
              <button>ENTER</button>
	      </form>
        
      </div>
    );
  }
}

export default App;
