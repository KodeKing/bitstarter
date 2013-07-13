#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML 
  tags/attributes.  Uses commander.js and cheerio. Teaches 
  command line application development and basic DOM parsing.
References:
 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/
        cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/
        commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var util = require('util');

var HTMLFILE_DEFAULT = "index.html";
var URL_DEFAULT = "http://obscure-cove-8479.herokuapp.com/"
var CHECKSFILE_DEFAULT = "checks.json";
var fname = "outJson"
var File2Check = ""

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/
                         // process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var urlFmt = function(turl) {
  return util.format(turl);
  };
  
var write2File = function(result,response) {
  if (results instanceof Error) {
   console.error('Error:  ' + util.format(response.message))
  } else {
   fs.writeFileSync(fname, ehaders);
   }
}
var url2File = function(turl, fname) {
    rest.get(turl).on('complete', write2File);
    }

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json',
            clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', 
            clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <URL>', 'URL', clone(assertFileExists),
            URL_DEFAULT)
        .parse(process.argv);
    console.log("start");    
    if (program.url) {
          console.log("got url "+ program.url);
          File2Check = program.url;
    } else {
          console.log("No url input");
          File2Check = rest.get(urlFmt(url)).on('complete', write2File(result,response));
    }      
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    fs.writeFile(fname, outJson, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 
    exports.checkHtmlFile = checkHtmlFile;
}