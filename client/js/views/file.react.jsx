var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Well = ReactBootstrap.Well;
var $ = require('jquery');
var jsDiff = require('diff');

//var currentFileCommit = {
  //"sha": "000ba5b55b2e76a8c80fc5459c79f2a2efbe1382",
  //"filename": "client/js/views/path.react.jsx",
  //"status": "modified",
  //"additions": 1,
  //"deletions": 2,
  //"changes": 3,
  //"blob_url": "https://github.com/IncognizantDoppelganger/gitpun/blob/a47fb452b1fb20ed61ff397cecf6f709ad6b2391/client/js/views/path.react.jsx",
  //"raw_url": "https://cdn.rawgit.com/IncognizantDoppelganger/gitpun/a47fb452b1fb20ed61ff397cecf6f709ad6b2391/client/js/views/path.react.jsx",
  //"contents_url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/contents/client/js/views/path.react.jsx?ref=a47fb452b1fb20ed61ff397cecf6f709ad6b2391",
  //"patch": "@@ -11,16 +11,15 @@ var Path = React.createClass({\n     var fullPath = this.props.currentPath.map(function(folder, index) {\n       return (\n           <span>\n+            <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,index-1)}>/</Button>\n             <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,index)}>\n               {folder}\n             </Button>\n-            <Button bsSize=\"xsmall\" bsStyle=\"link\">/</Button>\n           </span>\n         )\n     }.bind(this));\n     return (\n         <div>Path: \n-          <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,-1)}>/</Button>\n           {fullPath}\n         </div>\n       )"
//}

var File = React.createClass({
  getInitialState: function() {
    return {
      html : ''
    };
  },

  componentDidMount: function() {
    // var path = this.props.currentPath;
    // this.path = path;
    // var url = '';
    // var data = '';
    // var files = [];
    // if (this.props.currentCommit && this.props.currentCommit.files) {
    //   var files = JSON.parse(this.props.currentCommit.files);
    // }
    // for (var i = 0; i < files.length; i++) {
    //   if (files[i].filename === path) {
    //     url = files[i].raw_url.split('/');
    //     url[2] = 'cdn.rawgit.com';
    //     url.splice(5,1);
    //     url = url.join('/');
    //     this.setState ( {url} );
    //     break;
    //   }
    // }

    var url = this.props.filePaths[this.props.currentPath].raw_url.split('/');
    url[2] = 'cdn.rawgit.com';
    url.splice(5,1);
    url = url.join('/');
    this.setState ( {url} );

    $.get(url, function(success) {
      data = success;
      if (this.props.filePaths[this.props.currentPath].commitIndex === this.props.currentIndex && !!this.props.filePaths[this.props.currentPath].last_url) {
        this.secondaryMount(data,url);
      } else {
        this.setState ( {html: this.codeOr(data, url)} )
      }
    }.bind(this))
    .fail(function(error) {
      data = error.responseText;
      if (this.props.filePaths[this.props.currentPath].commitIndex === this.props.currentIndex && !!this.props.filePaths[this.props.currentPath].last_url) {
        this.secondaryMount(data,url);
      } else {
        this.setState ( {html: this.codeOr(data, url)} )
      }
    }.bind(this))
  },

  secondaryMount: function(data, url) {
    var previousUrl = this.props.filePaths[this.props.currentPath].last_url.split('/');
    previousUrl[2] = 'cdn.rawgit.com';
    previousUrl.splice(5,1);
    previousUrl = previousUrl.join('/');
    var previousData = '';
    $.get(previousUrl, function(previousSuccess) {
      previousData = previousSuccess;
      this.diff(data,previousData,url);
    }.bind(this))
    .fail(function(previousError) {
      previousData = previousError.responseText;
      this.diff(data,previousData,url);
    }.bind(this))
  },

  diff: function(data, pdata, url) {
    var diff = jsDiff.diffWords(pdata, data);
    this.setState ( {html: this.codeOr(diff, url)} );
  },

  codeOr: function(data, url) {
    var fileType = this.props.currentPath.split('.').pop();
    if (fileType === 'png' || fileType === 'gif' || fileType === 'jpg' || fileType === 'jpeg') {
      return (
          <Well bsSize='small'>
            <img src={url}/>
          </Well>
        )
    } else  {
      var style = {
        wordWrap: 'break-word; white-space; pre-wrap'
      }
      if (fileType !== 'json') {
        if (typeof data === 'string') {
          return (
              <pre style={style}>
                {data}
              </pre>
            )
        } else {
          return (
              <pre style={style}>
                {data.map(function(part) {
                  var colorStyle = {
                    color : part.added ? 'green' : part.removed ? 'red' : 'grey'
                  }
                  return (
                      <span style={colorStyle}>{part.value}</span>
                    )
                })}
              </pre>
            )
        }
      } else {
        if (typeof data === 'string') {
          return (
              <pre style={style}>
                {JSON.stringify(data)}
              </pre>
            )
        } else {
          return (
              <pre style={style}>
                {JSON.stringify(data)}
              </pre>
            )
        }
      }
    }
  },

  render: function () {
    return (
        <div>
          {this.state.html}
        </div>
      )
  }
});

module.exports = File;
